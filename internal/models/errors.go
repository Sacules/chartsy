package models

import "errors"

var (
	ErrNoRecord = errors.New("models: not matching record found")

	ErrInvalidCredentials = errors.New("models: invalid credentials")

	ErrDuplicateEmail = errors.New("models: duplicate email")
)
