<?php

namespace App\Http\Controllers\Quiz;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class QuizController extends Controller
{
    public function index(): Response
    {
        return inertia('Quiz/QuizHomePage');
    }

    public function start(): RedirectResponse
    {
        session([
            'quiz' => [
                'questions' => self::randomQuestions()->values()->all(),
                'answers' => [],
            ],
        ]);

        return redirect()->route('question.index', ['quizNum' => 1]);
    }

    public function getQuestions(): JsonResponse
    {
        $questions = self::sessionQuestions();

        return response()->json([
            'questions' => $questions ?: self::randomQuestions()->values()->all(),
        ]);
    }

    public function result(): Response|RedirectResponse
    {
        $quizSession = session('quiz');

        if (
            !$quizSession
            || empty($quizSession['answers'])
            || empty($quizSession['questions'])
        ) {
            return redirect()->route('quiz.index');
        }

        $questions = self::sessionQuestions();
        $score = collect($quizSession['answers'])
            ->filter(fn ($answer) => self::answerIsCorrect($answer))
            ->count();

        return inertia('Quiz/ResultPage', [
            'score' => $score,
            'totalQuestions' => count($questions),
            'answers' => collect($quizSession['answers'])
                ->map(fn ($answer) => self::normalizeAnswerRecord($answer))
                ->values()
                ->all(),
        ]);
    }

    public static function sessionQuestions(): array
    {
        return collect(session('quiz.questions', []))
            ->map(fn ($question) => self::normalizeQuestionPayload($question))
            ->values()
            ->all();
    }

    public static function totalQuestions(): int
    {
        return count(self::sessionQuestions());
    }

    public static function randomQuestions(int $limit = 10): Collection
    {
        $rows = DB::table('table_choices')->get();

        $classifiedRows = $rows->map(function ($row) {
            $questionContent = self::parseDeltaContent($row->question);

            return [
                'row' => $row,
                'has_image' => filled($questionContent['image']),
            ];
        });

        $imageRows = $classifiedRows
            ->where('has_image', true)
            ->shuffle()
            ->values();
        $textOnlyRows = $classifiedRows
            ->where('has_image', false)
            ->shuffle()
            ->values();

        $imageTarget = min((int) floor($limit / 2), $imageRows->count());
        $textTarget = min($limit - $imageTarget, $textOnlyRows->count());

        if ($imageTarget + $textTarget < $limit) {
            $remaining = $limit - ($imageTarget + $textTarget);
            $extraImage = min($remaining, $imageRows->count() - $imageTarget);
            $imageTarget += $extraImage;
            $remaining -= $extraImage;

            if ($remaining > 0) {
                $textTarget += min(
                    $remaining,
                    $textOnlyRows->count() - $textTarget
                );
            }
        }

        return $imageRows
            ->take($imageTarget)
            ->concat($textOnlyRows->take($textTarget))
            ->shuffle()
            ->values()
            ->map(
                fn ($item, $index) => self::mapQuestionRow(
                    $item['row'],
                    $index + 1
                )
            );
    }

    private static function mapQuestionRow(object $row, int $number): array
    {
        $questionContent = self::parseDeltaContent($row->question);
        $choices = collect(['choice1', 'choice2', 'choice3', 'choice4'])
            ->mapWithKeys(function ($choiceKey) use ($row) {
                return [
                    $choiceKey => self::parseDeltaContent($row->{$choiceKey}),
                ];
            });
        $answerKey = self::normalizeAnswerKey($row->answer);

        return [
            'id' => (int) $row->id,
            'number' => $number,
            'level_of_difficulty' => (int) $row->level_of_difficulty,
            'question' => $questionContent['text'],
            'question_image' => $questionContent['image'],
            'choices' => $choices
                ->map(fn ($choice, $key) => [
                    'key' => $key,
                    'text' => $choice['text'],
                    'image' => $choice['image'],
                ])
                ->values()
                ->all(),
            'answer_key' => $answerKey,
            'answer' => $choices[$answerKey]['text'] ?? null,
        ];
    }

    public static function normalizeQuestionPayload(array $question): array
    {
        $question['answer_key'] = self::normalizeAnswerKey(
            $question['answer_key'] ?? null
        );

        if (!empty($question['choices']) && is_array($question['choices'])) {
            $choices = collect($question['choices'])
                ->map(function ($choice) {
                    if (!is_array($choice)) {
                        return $choice;
                    }

                    $choice['key'] = self::normalizeAnswerKey(
                        $choice['key'] ?? null
                    );

                    return $choice;
                })
                ->values();

            $question['choices'] = $choices->all();
            $question['answer'] = $choices
                ->firstWhere('key', $question['answer_key'])['text'] ?? ($question['answer'] ?? null);
        }

        return $question;
    }

    public static function normalizeAnswerRecord(array $answer): array
    {
        $answer['selected_answer_key'] = self::normalizeAnswerKey(
            $answer['selected_answer_key'] ?? null
        );
        $answer['correct_answer_key'] = self::normalizeAnswerKey(
            $answer['correct_answer_key'] ?? null
        );
        $answer['is_correct'] = self::answerIsCorrect($answer);

        return $answer;
    }

    private static function parseDeltaContent(?string $rawJson): array
    {
        $delta = self::decodeDelta($rawJson);
        $text = collect($delta)
            ->map(function ($item) {
                $insert = $item['insert'] ?? null;
                return is_string($insert) ? $insert : '';
            })
            ->implode('');

        $image = collect($delta)
            ->map(function ($item) {
                return $item['insert']['image'] ?? null;
            })
            ->first(fn ($value) => filled($value));

        return [
            'text' => trim(preg_replace('/\s+/', ' ', $text ?? '')),
            'image' => $image,
        ];
    }

    private static function decodeDelta(?string $rawJson): array
    {
        if (!$rawJson) {
            return [];
        }

        $decoded = json_decode($rawJson, true);

        if (is_string($decoded)) {
            $decoded = json_decode($decoded, true);
        }

        if (isset($decoded['ops']) && is_array($decoded['ops'])) {
            return $decoded['ops'];
        }

        return is_array($decoded) ? $decoded : [];
    }

    public static function normalizeAnswerKey(mixed $answerKey): ?string
    {
        if ($answerKey === null) {
            return null;
        }

        $normalized = trim((string) $answerKey);
        $decoded = json_decode($normalized, true);

        if (is_string($decoded)) {
            $normalized = $decoded;
        }

        $normalized = trim($normalized, " \t\n\r\0\x0B\"'");

        return $normalized !== '' ? $normalized : null;
    }

    public static function answerIsCorrect(array $answer): bool
    {
        return self::normalizeAnswerKey($answer['selected_answer_key'] ?? null)
            !== null
            && self::normalizeAnswerKey($answer['selected_answer_key'] ?? null)
                === self::normalizeAnswerKey(
                    $answer['correct_answer_key'] ?? null
                );
    }
}
