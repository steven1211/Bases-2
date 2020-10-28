-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema progra
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema progra
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `progra` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `progra` ;

-- -----------------------------------------------------
-- Table `progra`.`comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `progra`.`comments` (
  `product_id` VARCHAR(30) NOT NULL,
  `customer_userName` VARCHAR(20) NOT NULL,
  `customer_fullName` VARCHAR(20) NULL DEFAULT NULL,
  `commentDescription` VARCHAR(10000) NULL DEFAULT NULL,
  `commentDate` DATETIME NULL DEFAULT NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `progra`.`ratings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `progra`.`ratings` (
  `product_id` VARCHAR(30) NOT NULL,
  `customer_userName` VARCHAR(20) NOT NULL,
  `stars_given` TINYINT NOT NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
