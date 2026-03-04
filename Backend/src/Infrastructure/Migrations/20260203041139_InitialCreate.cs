using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "exam_structures",
                columns: table => new
                {
                    exam_structure_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    total_parts = table.Column<int>(type: "integer", nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_exam_structures", x => x.exam_structure_id);
                });

            migrationBuilder.CreateTable(
                name: "hint_types",
                columns: table => new
                {
                    hint_type_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    description = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_hint_types", x => x.hint_type_id);
                });

            migrationBuilder.CreateTable(
                name: "levels",
                columns: table => new
                {
                    level_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    level_code = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: false),
                    description = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_levels", x => x.level_id);
                });

            migrationBuilder.CreateTable(
                name: "part_types",
                columns: table => new
                {
                    part_type_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    description = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_part_types", x => x.part_type_id);
                });

            migrationBuilder.CreateTable(
                name: "practice_modes",
                columns: table => new
                {
                    mode_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    description = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_practice_modes", x => x.mode_id);
                });

            migrationBuilder.CreateTable(
                name: "prompt_purposes",
                columns: table => new
                {
                    purpose_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    description = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_prompt_purposes", x => x.purpose_id);
                });

            migrationBuilder.CreateTable(
                name: "sample_types",
                columns: table => new
                {
                    sample_type_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    description = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sample_types", x => x.sample_type_id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    username = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    phone_number = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    password_hash = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    role = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    target_level_id = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.user_id);
                    table.ForeignKey(
                        name: "FK_users_levels_target_level_id",
                        column: x => x.target_level_id,
                        principalTable: "levels",
                        principalColumn: "level_id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "parts",
                columns: table => new
                {
                    part_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    exam_structure_id = table.Column<int>(type: "integer", nullable: false),
                    part_type_id = table.Column<int>(type: "integer", nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    time_limit = table.Column<int>(type: "integer", nullable: true),
                    min_words = table.Column<int>(type: "integer", nullable: true),
                    max_words = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_parts", x => x.part_id);
                    table.ForeignKey(
                        name: "FK_parts_exam_structures_exam_structure_id",
                        column: x => x.exam_structure_id,
                        principalTable: "exam_structures",
                        principalColumn: "exam_structure_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_parts_part_types_part_type_id",
                        column: x => x.part_type_id,
                        principalTable: "part_types",
                        principalColumn: "part_type_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "password_reset_tokens",
                columns: table => new
                {
                    token_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    token = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    used = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_password_reset_tokens", x => x.token_id);
                    table.ForeignKey(
                        name: "FK_password_reset_tokens_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "practice_sessions",
                columns: table => new
                {
                    session_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    mode_id = table.Column<int>(type: "integer", nullable: false),
                    is_random = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_practice_sessions", x => x.session_id);
                    table.ForeignKey(
                        name: "FK_practice_sessions_practice_modes_mode_id",
                        column: x => x.mode_id,
                        principalTable: "practice_modes",
                        principalColumn: "mode_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_practice_sessions_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "scoring_criteria",
                columns: table => new
                {
                    criteria_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    part_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    weight = table.Column<float>(type: "real", nullable: false),
                    max_score = table.Column<int>(type: "integer", nullable: false, defaultValue: 10)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_scoring_criteria", x => x.criteria_id);
                    table.ForeignKey(
                        name: "FK_scoring_criteria_parts_part_id",
                        column: x => x.part_id,
                        principalTable: "parts",
                        principalColumn: "part_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "system_prompts",
                columns: table => new
                {
                    prompt_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    part_id = table.Column<int>(type: "integer", nullable: false),
                    level_id = table.Column<int>(type: "integer", nullable: false),
                    purpose_id = table.Column<int>(type: "integer", nullable: false),
                    prompt_content = table.Column<string>(type: "text", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_system_prompts", x => x.prompt_id);
                    table.ForeignKey(
                        name: "FK_system_prompts_levels_level_id",
                        column: x => x.level_id,
                        principalTable: "levels",
                        principalColumn: "level_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_system_prompts_parts_part_id",
                        column: x => x.part_id,
                        principalTable: "parts",
                        principalColumn: "part_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_system_prompts_prompt_purposes_purpose_id",
                        column: x => x.purpose_id,
                        principalTable: "prompt_purposes",
                        principalColumn: "purpose_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "topics",
                columns: table => new
                {
                    topic_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    part_id = table.Column<int>(type: "integer", nullable: false),
                    topic_name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    context = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    purpose = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    recipient_role = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    difficulty_level_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_topics", x => x.topic_id);
                    table.ForeignKey(
                        name: "FK_topics_levels_difficulty_level_id",
                        column: x => x.difficulty_level_id,
                        principalTable: "levels",
                        principalColumn: "level_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_topics_parts_part_id",
                        column: x => x.part_id,
                        principalTable: "parts",
                        principalColumn: "part_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "hints",
                columns: table => new
                {
                    hint_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    topic_id = table.Column<int>(type: "integer", nullable: false),
                    level_id = table.Column<int>(type: "integer", nullable: false),
                    hint_type_id = table.Column<int>(type: "integer", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    display_order = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_hints", x => x.hint_id);
                    table.ForeignKey(
                        name: "FK_hints_hint_types_hint_type_id",
                        column: x => x.hint_type_id,
                        principalTable: "hint_types",
                        principalColumn: "hint_type_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_hints_levels_level_id",
                        column: x => x.level_id,
                        principalTable: "levels",
                        principalColumn: "level_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_hints_topics_topic_id",
                        column: x => x.topic_id,
                        principalTable: "topics",
                        principalColumn: "topic_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "sample_texts",
                columns: table => new
                {
                    sample_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    topic_id = table.Column<int>(type: "integer", nullable: false),
                    level_id = table.Column<int>(type: "integer", nullable: false),
                    sample_type_id = table.Column<int>(type: "integer", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    author = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sample_texts", x => x.sample_id);
                    table.ForeignKey(
                        name: "FK_sample_texts_levels_level_id",
                        column: x => x.level_id,
                        principalTable: "levels",
                        principalColumn: "level_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_sample_texts_sample_types_sample_type_id",
                        column: x => x.sample_type_id,
                        principalTable: "sample_types",
                        principalColumn: "sample_type_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_sample_texts_topics_topic_id",
                        column: x => x.topic_id,
                        principalTable: "topics",
                        principalColumn: "topic_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_submissions",
                columns: table => new
                {
                    submission_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    session_id = table.Column<int>(type: "integer", nullable: false),
                    topic_id = table.Column<int>(type: "integer", nullable: false),
                    part_id = table.Column<int>(type: "integer", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    word_count = table.Column<int>(type: "integer", nullable: true),
                    enable_hint = table.Column<bool>(type: "boolean", nullable: false),
                    submitted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_submissions", x => x.submission_id);
                    table.ForeignKey(
                        name: "FK_user_submissions_parts_part_id",
                        column: x => x.part_id,
                        principalTable: "parts",
                        principalColumn: "part_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_user_submissions_practice_sessions_session_id",
                        column: x => x.session_id,
                        principalTable: "practice_sessions",
                        principalColumn: "session_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_submissions_topics_topic_id",
                        column: x => x.topic_id,
                        principalTable: "topics",
                        principalColumn: "topic_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "vocabulary_sets",
                columns: table => new
                {
                    vocab_set_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    topic_id = table.Column<int>(type: "integer", nullable: false),
                    level_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vocabulary_sets", x => x.vocab_set_id);
                    table.ForeignKey(
                        name: "FK_vocabulary_sets_levels_level_id",
                        column: x => x.level_id,
                        principalTable: "levels",
                        principalColumn: "level_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_vocabulary_sets_topics_topic_id",
                        column: x => x.topic_id,
                        principalTable: "topics",
                        principalColumn: "topic_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ai_evaluations",
                columns: table => new
                {
                    evaluation_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    submission_id = table.Column<int>(type: "integer", nullable: false),
                    total_score = table.Column<float>(type: "real", nullable: true),
                    estimated_level_id = table.Column<int>(type: "integer", nullable: true),
                    overall_feedback = table.Column<string>(type: "text", nullable: true),
                    strengths = table.Column<string>(type: "text", nullable: true),
                    weaknesses = table.Column<string>(type: "text", nullable: true),
                    suggestions = table.Column<string>(type: "text", nullable: true),
                    evaluated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ai_evaluations", x => x.evaluation_id);
                    table.ForeignKey(
                        name: "FK_ai_evaluations_levels_estimated_level_id",
                        column: x => x.estimated_level_id,
                        principalTable: "levels",
                        principalColumn: "level_id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ai_evaluations_user_submissions_submission_id",
                        column: x => x.submission_id,
                        principalTable: "user_submissions",
                        principalColumn: "submission_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "language_checks",
                columns: table => new
                {
                    check_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    submission_id = table.Column<int>(type: "integer", nullable: false),
                    spelling_errors = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    grammar_errors = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    syntax_errors = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    feedback = table.Column<string>(type: "text", nullable: true),
                    checked_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_language_checks", x => x.check_id);
                    table.ForeignKey(
                        name: "FK_language_checks_user_submissions_submission_id",
                        column: x => x.submission_id,
                        principalTable: "user_submissions",
                        principalColumn: "submission_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "sentence_structures",
                columns: table => new
                {
                    structure_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    vocab_set_id = table.Column<int>(type: "integer", nullable: false),
                    pattern = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    usage_note = table.Column<string>(type: "text", nullable: true),
                    example = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sentence_structures", x => x.structure_id);
                    table.ForeignKey(
                        name: "FK_sentence_structures_vocabulary_sets_vocab_set_id",
                        column: x => x.vocab_set_id,
                        principalTable: "vocabulary_sets",
                        principalColumn: "vocab_set_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "vocabulary_items",
                columns: table => new
                {
                    vocab_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    vocab_set_id = table.Column<int>(type: "integer", nullable: false),
                    word = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    meaning = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    example_sentence = table.Column<string>(type: "text", nullable: true),
                    part_of_speech = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vocabulary_items", x => x.vocab_id);
                    table.ForeignKey(
                        name: "FK_vocabulary_items_vocabulary_sets_vocab_set_id",
                        column: x => x.vocab_set_id,
                        principalTable: "vocabulary_sets",
                        principalColumn: "vocab_set_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "criteria_scores",
                columns: table => new
                {
                    criteria_score_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    evaluation_id = table.Column<int>(type: "integer", nullable: false),
                    criteria_id = table.Column<int>(type: "integer", nullable: false),
                    score = table.Column<float>(type: "real", nullable: true),
                    feedback = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_criteria_scores", x => x.criteria_score_id);
                    table.ForeignKey(
                        name: "FK_criteria_scores_ai_evaluations_evaluation_id",
                        column: x => x.evaluation_id,
                        principalTable: "ai_evaluations",
                        principalColumn: "evaluation_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_criteria_scores_scoring_criteria_criteria_id",
                        column: x => x.criteria_id,
                        principalTable: "scoring_criteria",
                        principalColumn: "criteria_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ai_evaluations_estimated_level_id",
                table: "ai_evaluations",
                column: "estimated_level_id");

            migrationBuilder.CreateIndex(
                name: "IX_ai_evaluations_submission_id",
                table: "ai_evaluations",
                column: "submission_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_criteria_scores_criteria_id",
                table: "criteria_scores",
                column: "criteria_id");

            migrationBuilder.CreateIndex(
                name: "IX_criteria_scores_evaluation_id",
                table: "criteria_scores",
                column: "evaluation_id");

            migrationBuilder.CreateIndex(
                name: "IX_exam_structures_name",
                table: "exam_structures",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_hint_types_code",
                table: "hint_types",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_hints_hint_type_id",
                table: "hints",
                column: "hint_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_hints_level_id",
                table: "hints",
                column: "level_id");

            migrationBuilder.CreateIndex(
                name: "IX_hints_topic_id",
                table: "hints",
                column: "topic_id");

            migrationBuilder.CreateIndex(
                name: "IX_language_checks_submission_id",
                table: "language_checks",
                column: "submission_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_levels_level_code",
                table: "levels",
                column: "level_code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_part_types_code",
                table: "part_types",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_parts_exam_structure_part_type",
                table: "parts",
                columns: new[] { "exam_structure_id", "part_type_id" });

            migrationBuilder.CreateIndex(
                name: "IX_parts_part_type_id",
                table: "parts",
                column: "part_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_password_reset_tokens_expires_at",
                table: "password_reset_tokens",
                column: "expires_at");

            migrationBuilder.CreateIndex(
                name: "IX_password_reset_tokens_token",
                table: "password_reset_tokens",
                column: "token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_password_reset_tokens_user_id",
                table: "password_reset_tokens",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_practice_modes_code",
                table: "practice_modes",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_practice_sessions_mode_id",
                table: "practice_sessions",
                column: "mode_id");

            migrationBuilder.CreateIndex(
                name: "IX_practice_sessions_user_id",
                table: "practice_sessions",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_practice_sessions_user_id_mode_id",
                table: "practice_sessions",
                columns: new[] { "user_id", "mode_id" });

            migrationBuilder.CreateIndex(
                name: "IX_prompt_purposes_code",
                table: "prompt_purposes",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_sample_texts_level_id",
                table: "sample_texts",
                column: "level_id");

            migrationBuilder.CreateIndex(
                name: "IX_sample_texts_sample_type_id",
                table: "sample_texts",
                column: "sample_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_sample_texts_topic_id",
                table: "sample_texts",
                column: "topic_id");

            migrationBuilder.CreateIndex(
                name: "IX_sample_types_code",
                table: "sample_types",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_scoring_criteria_part_id",
                table: "scoring_criteria",
                column: "part_id");

            migrationBuilder.CreateIndex(
                name: "IX_sentence_structures_vocab_set_id",
                table: "sentence_structures",
                column: "vocab_set_id");

            migrationBuilder.CreateIndex(
                name: "IX_system_prompts_level_id",
                table: "system_prompts",
                column: "level_id");

            migrationBuilder.CreateIndex(
                name: "IX_system_prompts_part_id",
                table: "system_prompts",
                column: "part_id");

            migrationBuilder.CreateIndex(
                name: "IX_system_prompts_purpose_id",
                table: "system_prompts",
                column: "purpose_id");

            migrationBuilder.CreateIndex(
                name: "IX_topics_difficulty_level_id",
                table: "topics",
                column: "difficulty_level_id");

            migrationBuilder.CreateIndex(
                name: "IX_topics_part_id",
                table: "topics",
                column: "part_id");

            migrationBuilder.CreateIndex(
                name: "IX_topics_topic_name",
                table: "topics",
                column: "topic_name");

            migrationBuilder.CreateIndex(
                name: "IX_user_submissions_part_id",
                table: "user_submissions",
                column: "part_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_submissions_session_id",
                table: "user_submissions",
                column: "session_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_submissions_session_id_topic_id",
                table: "user_submissions",
                columns: new[] { "session_id", "topic_id" });

            migrationBuilder.CreateIndex(
                name: "IX_user_submissions_topic_id",
                table: "user_submissions",
                column: "topic_id");

            migrationBuilder.CreateIndex(
                name: "IX_users_email",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_phone_number",
                table: "users",
                column: "phone_number",
                unique: true,
                filter: "[phone_number] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_users_target_level_id",
                table: "users",
                column: "target_level_id");

            migrationBuilder.CreateIndex(
                name: "IX_users_username",
                table: "users",
                column: "username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_vocabulary_items_vocab_set_id",
                table: "vocabulary_items",
                column: "vocab_set_id");

            migrationBuilder.CreateIndex(
                name: "IX_vocabulary_sets_level_id",
                table: "vocabulary_sets",
                column: "level_id");

            migrationBuilder.CreateIndex(
                name: "IX_vocabulary_sets_topic_id",
                table: "vocabulary_sets",
                column: "topic_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "criteria_scores");

            migrationBuilder.DropTable(
                name: "hints");

            migrationBuilder.DropTable(
                name: "language_checks");

            migrationBuilder.DropTable(
                name: "password_reset_tokens");

            migrationBuilder.DropTable(
                name: "sample_texts");

            migrationBuilder.DropTable(
                name: "sentence_structures");

            migrationBuilder.DropTable(
                name: "system_prompts");

            migrationBuilder.DropTable(
                name: "vocabulary_items");

            migrationBuilder.DropTable(
                name: "ai_evaluations");

            migrationBuilder.DropTable(
                name: "scoring_criteria");

            migrationBuilder.DropTable(
                name: "hint_types");

            migrationBuilder.DropTable(
                name: "sample_types");

            migrationBuilder.DropTable(
                name: "prompt_purposes");

            migrationBuilder.DropTable(
                name: "vocabulary_sets");

            migrationBuilder.DropTable(
                name: "user_submissions");

            migrationBuilder.DropTable(
                name: "practice_sessions");

            migrationBuilder.DropTable(
                name: "topics");

            migrationBuilder.DropTable(
                name: "practice_modes");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "parts");

            migrationBuilder.DropTable(
                name: "levels");

            migrationBuilder.DropTable(
                name: "exam_structures");

            migrationBuilder.DropTable(
                name: "part_types");
        }
    }
}
