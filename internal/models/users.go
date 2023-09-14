package models

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID             int
	Email          string
	HashedPassword []byte
	Created        time.Time
}

type UserModel struct {
	DB *sqlx.DB
}

func (m *UserModel) Insert(email, password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		return err
	}

	stmt := `INSERT INTO users (email, hashed_password) VALUES (?, ?)`

	_, err = m.DB.Exec(stmt, email, string(hashedPassword))
	if err != nil {
		var sqliteError sqlite3.Error
		if errors.As(err, &sqliteError) && errors.Is(sqliteError.Code, sqlite3.ErrConstraint) {
			return ErrDuplicateEmail
		}

		return err
	}

	return nil
}

func (m *UserModel) Authenticate(email, password string) (int, error) {
	var id int
	var hashedPassword []byte

	stmt := `SELECT rowid, hashed_password
				FROM users
				WHERE email = ?`

	err := m.DB.QueryRow(stmt, email).Scan(&id, &hashedPassword)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, ErrInvalidCredentials
		}

		return 0, err
	}

	err = bcrypt.CompareHashAndPassword(hashedPassword, []byte(password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return 0, ErrInvalidCredentials
		}

		return 0, err
	}

	return id, nil
}

func (m *UserModel) Exists(id int) (bool, error) {
	return false, nil
}

func (m *UserModel) Verify(email string) (int, error) {
	stmt := `UPDATE users
				SET is_verified = true
				WHERE email = ?`

	_, err := m.DB.Exec(stmt, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, ErrNoRecord
		}

		return 0, fmt.Errorf("models: couldn't update the user to verified: %s", err)
	}

	stmt = `SELECT rowid
				FROM users
				WHERE email = ?`

	var id int
	err = m.DB.Get(&id, stmt, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, ErrNoRecord
		}

		return 0, fmt.Errorf("models: couldn't update the user to verified: %s", err)
	}

	return id, nil
}
