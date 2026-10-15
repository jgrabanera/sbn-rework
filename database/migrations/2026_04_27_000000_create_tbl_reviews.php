<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('area_id')->nullable()->index();
            $table->unsignedTinyInteger('interaction_rating');
            $table->unsignedTinyInteger('interface_design_rating');
            $table->unsignedTinyInteger('navigation_rating');
            $table->unsignedTinyInteger('response_speed_rating');
            $table->unsignedTinyInteger('information_relevance_rating');
            $table->unsignedTinyInteger('content_usefulness_rating');
            $table->unsignedTinyInteger('overall_satisfaction_rating');
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_reviews');
    }
};
