-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "institution" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "admin_code" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "user_email" TEXT,
    "admin_code" TEXT,
    "method" VARCHAR(10) NOT NULL,
    "endpoint" VARCHAR(500) NOT NULL,
    "status_code" INTEGER NOT NULL,
    "ip_address" VARCHAR(100),
    "user_agent" TEXT,
    "request_body" TEXT,
    "response_body" TEXT,
    "execution_time" INTEGER,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_log" (
    "attendance_id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "timetable_id" INTEGER NOT NULL,
    "scheduled_teacher_id" INTEGER NOT NULL,
    "detected_teacher_id" INTEGER,
    "attendance_date" DATE NOT NULL,
    "period_start" TIME(6) NOT NULL,
    "period_end" TIME(6) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "confidence_score" DECIMAL(5,2),
    "locked" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_log_pkey" PRIMARY KEY ("attendance_id")
);

-- CreateTable
CREATE TABLE "classes" (
    "class_id" SERIAL NOT NULL,
    "class_name" VARCHAR(100) NOT NULL,
    "department" VARCHAR(100),
    "semester" INTEGER,
    "section" VARCHAR(10),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("class_id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "subject_id" SERIAL NOT NULL,
    "subject_name" VARCHAR(150) NOT NULL,
    "subject_code" VARCHAR(50) NOT NULL,
    "department" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("subject_id")
);

-- CreateTable
CREATE TABLE "teacher_substitution" (
    "substitution_id" SERIAL NOT NULL,
    "timetable_id" INTEGER NOT NULL,
    "original_teacher_id" INTEGER NOT NULL,
    "substitute_teacher_id" INTEGER NOT NULL,
    "substitution_date" DATE NOT NULL,
    "approved_by" VARCHAR(150),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_substitution_pkey" PRIMARY KEY ("substitution_id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "teacher_id" SERIAL NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "department" VARCHAR(100),
    "phone" VARCHAR(20),
    "qualification" VARCHAR(50),
    "staff_image_path" TEXT NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("teacher_id")
);

-- CreateTable
CREATE TABLE "timetable" (
    "timetable_id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "day_of_week" VARCHAR(20) NOT NULL,
    "start_time" TIME(6) NOT NULL,
    "end_time" TIME(6) NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timetable_pkey" PRIMARY KEY ("timetable_id")
);

-- CreateTable
CREATE TABLE "teachers_archive" (
    "teacher_id" SERIAL NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "department" VARCHAR(100),
    "phone" VARCHAR(20),
    "qualification" VARCHAR(50),
    "staff_image_path" TEXT NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teachers_archive_pkey" PRIMARY KEY ("teacher_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "AuditLog_user_id_idx" ON "AuditLog"("user_id");

-- CreateIndex
CREATE INDEX "AuditLog_endpoint_idx" ON "AuditLog"("endpoint");

-- CreateIndex
CREATE INDEX "AuditLog_created_at_idx" ON "AuditLog"("created_at");

-- CreateIndex
CREATE INDEX "AuditLog_admin_code_idx" ON "AuditLog"("admin_code");

-- CreateIndex
CREATE INDEX "AuditLog_status_code_idx" ON "AuditLog"("status_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_attendance_per_period" ON "attendance_log"("timetable_id", "attendance_date");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_subject_code_key" ON "subjects"("subject_code");

-- CreateIndex
CREATE INDEX "idx_substitution_date" ON "teacher_substitution"("substitution_date");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_email_key" ON "teachers"("email");

-- CreateIndex
CREATE INDEX "idx_teacher_active" ON "teachers"("is_active");

-- CreateIndex
CREATE INDEX "idx_teacher_email" ON "teachers"("email");

-- CreateIndex
CREATE INDEX "idx_timetable_day_time" ON "timetable"("day_of_week", "start_time", "end_time");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_archive_email_key" ON "teachers_archive"("email");

-- CreateIndex
CREATE INDEX "idx_teacher_archive_active" ON "teachers_archive"("is_active");

-- CreateIndex
CREATE INDEX "idx_teacher_archive_email" ON "teachers_archive"("email");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_log" ADD CONSTRAINT "fk_class_att" FOREIGN KEY ("class_id") REFERENCES "classes"("class_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "attendance_log" ADD CONSTRAINT "fk_detected_teacher" FOREIGN KEY ("detected_teacher_id") REFERENCES "teachers"("teacher_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "attendance_log" ADD CONSTRAINT "fk_scheduled_teacher" FOREIGN KEY ("scheduled_teacher_id") REFERENCES "teachers"("teacher_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "attendance_log" ADD CONSTRAINT "fk_subject_att" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "attendance_log" ADD CONSTRAINT "fk_timetable_att" FOREIGN KEY ("timetable_id") REFERENCES "timetable"("timetable_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teacher_substitution" ADD CONSTRAINT "fk_original_teacher" FOREIGN KEY ("original_teacher_id") REFERENCES "teachers"("teacher_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teacher_substitution" ADD CONSTRAINT "fk_substitute_teacher" FOREIGN KEY ("substitute_teacher_id") REFERENCES "teachers"("teacher_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teacher_substitution" ADD CONSTRAINT "fk_timetable_sub" FOREIGN KEY ("timetable_id") REFERENCES "timetable"("timetable_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timetable" ADD CONSTRAINT "fk_class" FOREIGN KEY ("class_id") REFERENCES "classes"("class_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timetable" ADD CONSTRAINT "fk_subject" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timetable" ADD CONSTRAINT "fk_teacher" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("teacher_id") ON DELETE CASCADE ON UPDATE NO ACTION;
