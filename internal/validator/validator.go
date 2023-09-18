package validator

import (
	"net/mail"
	"net/url"
	"regexp"
	"strings"
	"unicode/utf8"

	"golang.org/x/exp/constraints"
)

var (
	RGBColorRegex = regexp.MustCompile("^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$")
)

type Validator struct {
	FieldErrors map[string]string
}

func (v *Validator) Valid() bool {
	return len(v.FieldErrors) == 0
}

func (v *Validator) AddFieldError(key, message string) {
	if v.FieldErrors == nil {
		v.FieldErrors = make(map[string]string)
	}

	if _, exists := v.FieldErrors[key]; !exists {
		v.FieldErrors[key] = message
	}
}

func (v *Validator) CheckField(ok bool, key, message string) {
	if !ok {
		v.AddFieldError(key, message)
	}
}

func NotBlank(value string) bool {
	return strings.TrimSpace(value) != ""
}

func MinChars(value string, n int) bool {
	return utf8.RuneCountInString(value) >= n
}

func MaxChars(value string, n int) bool {
	return utf8.RuneCountInString(value) <= n
}

func NotZero[T constraints.Integer](value T) bool {
	return value != 0
}

func Positive[T constraints.Integer](value T) bool {
	return value > 0
}

func PermittedInt(value int, permittedValues ...int) bool {
	for i := range permittedValues {
		if value == permittedValues[i] {
			return true
		}
	}

	return false
}

func Matches(value string, rx *regexp.Regexp) bool {
	return rx.MatchString(value)
}

func Email(value string) bool {
	_, err := mail.ParseAddress(value)
	return err == nil
}

func URL(value string) bool {
	_, err := url.Parse(value)
	return err == nil
}
