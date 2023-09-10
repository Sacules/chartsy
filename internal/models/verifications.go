package models

import (
	"time"

	"github.com/jmoiron/sqlx"
)

type Verification struct {
	Email     string    `db:"email"`
	Code      string    `db:"code"`
	ExpiresAt time.Time `db:"expires_at"`
}

type VerificationModel struct {
	DB *sqlx.DB
}

func (v *VerificationModel) Insert(email, code string) error {
	stmt := "INSERT INTO verifications (email, code, expires_at) VALUES (?, ?, ?)"
	expiresAt := time.Now().Add(24 * time.Hour)

	_, err := v.DB.Exec(stmt, email, code, expiresAt)

	return err
}

func (v *VerificationModel) Get(email string) (*Verification, error) {
	stmt := "SELECT email, code, expires_at FROM verifications WHERE email = ?"

	ver := Verification{}
	err := v.DB.Get(&ver, stmt, email)

	return &ver, err
}
