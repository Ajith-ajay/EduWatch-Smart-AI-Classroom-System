-- CreateTable
CREATE TABLE "Teacher" (
    "teacher_id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT,
    "subject" TEXT,
    "phone" TEXT,
    "qualification" TEXT,
    "staff_image_path" TEXT,
    "face_encoding_path" TEXT NOT NULL,
    "voice_encoding_path" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("teacher_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");
