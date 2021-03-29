/*
  Warnings:

  - You are about to drop the `_studentsAndClasses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_studentsAndClasses` DROP FOREIGN KEY `_studentsAndClasses_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_studentsAndClasses` DROP FOREIGN KEY `_studentsAndClasses_ibfk_2`;

-- DropTable
DROP TABLE `_studentsAndClasses`;

-- CreateTable
CREATE TABLE `_student_Classes` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,
UNIQUE INDEX `_student_Classes_AB_unique`(`A`, `B`),
INDEX `_student_Classes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_student_Classes` ADD FOREIGN KEY (`A`) REFERENCES `classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_student_Classes` ADD FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
