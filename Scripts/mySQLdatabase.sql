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
-- Table `progra`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `progra`.`category` (
  `idcategory` INT NOT NULL AUTO_INCREMENT,
  `category` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idcategory`))
ENGINE = InnoDB
AUTO_INCREMENT = 748
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `progra`.`personxpurchase`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `progra`.`personxpurchase` (
  `idPurchase` INT NOT NULL AUTO_INCREMENT,
  `idPerson` VARCHAR(45) NOT NULL,
  `Date` DATE NOT NULL,
  `isPublic` VARCHAR(45) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`idPurchase`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `progra`.`productxpurchase`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `progra`.`productxpurchase` (
  `idPurchase` INT NOT NULL,
  `idProduct` VARCHAR(45) NOT NULL,
  `Quantity` INT NOT NULL,
  INDEX `IDPURCHASE_idx` (`idPurchase` ASC) VISIBLE,
  CONSTRAINT `IDPURCHASE`
    FOREIGN KEY (`idPurchase`)
    REFERENCES `progra`.`personxpurchase` (`idPurchase`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
