<?php

namespace App\Http\Controllers\Quiz;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Inertia\Response;

class QuestionController extends Controller
{
    public function index(Request $request, $quizNum): Response|RedirectResponse
    {
        $questions = QuizController::sessionQuestions();

        if (empty($questions)) {
            return redirect()->route('quiz.start');
        }

        $question = Arr::first(
            $questions,
            fn($item) => (int) $item['number'] === (int) $quizNum
        );
        $question = $question
            ? QuizController::normalizeQuestionPayload($question)
            : null;

        abort_unless($question, 404);

        $quizSession = session('quiz', ['answers' => []]);
        $savedAnswerKey = $quizSession['answers'][(int) $quizNum]['selected_answer_key'] ?? null;
        $answerStates = collect($quizSession['answers'])
            ->mapWithKeys(function ($answer, $questionNumber) {
                $normalized = QuizController::normalizeAnswerRecord($answer);

                return [
                    (int) $questionNumber => $normalized['is_correct']
                        ? 'correct'
                        : 'wrong',
                ];
            })
            ->all();

        return inertia('Quiz/QuestionPage', [
            'quizNum' => (int) $quizNum,
            'question' => $question,
            'totalQuestions' => count($questions),
            'selectedAnswer' => $savedAnswerKey,
            'answeredQuestions' => array_map(
                'intval',
                array_keys($quizSession['answers'])
            ),
            'answerStates' => $answerStates,
        ]);
    }

    public function submit(Request $request, $quizNum): RedirectResponse
    {
        $questions = QuizController::sessionQuestions();

        if (empty($questions)) {
            return redirect()->route('quiz.start');
        }

        $question = Arr::first(
            $questions,
            fn($item) => (int) $item['number'] === (int) $quizNum
        );
        $question = $question
            ? QuizController::normalizeQuestionPayload($question)
            : null;

        abort_unless($question, 404);

        $validated = $request->validate([
            'selected_answer' => ['nullable', 'string'],
        ]);

        $selectedAnswerKey = QuizController::normalizeAnswerKey(
            $validated['selected_answer'] ?? null
        );
        $choiceKeys = collect($question['choices'])->pluck('key')->all();

        abort_unless(
            $selectedAnswerKey === null
            || in_array($selectedAnswerKey, $choiceKeys, true),
            422
        );

        $selectedChoice = collect($question['choices'])
            ->firstWhere('key', $selectedAnswerKey);

        $quizSession = session('quiz', ['questions' => $questions, 'answers' => []]);
        $quizSession['answers'][(int) $quizNum] = [
            'question_number' => (int) $quizNum,
            'question' => $question['question'],
            'question_image' => $question['question_image'],
            'selected_answer_key' => $selectedAnswerKey,
            'selected_answer' => $selectedChoice['text'] ?? null,
            'correct_answer' => $question['answer'],
            'correct_answer_key' => $question['answer_key'],
            'is_correct' => QuizController::answerIsCorrect([
                'selected_answer_key' => $selectedAnswerKey,
                'correct_answer_key' => $question['answer_key'],
            ]),
        ];

        session(['quiz' => $quizSession]);

        if ((int) $quizNum < QuizController::totalQuestions()) {
            return redirect()->route('question.index', [
                'quizNum' => (int) $quizNum + 1,
            ]);
        }

        return redirect()->route('quiz.result');
    }
}
