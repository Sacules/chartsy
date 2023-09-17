package models

import (
	"database/sql"
	"errors"
	"strconv"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
)

// Image represents the core of a chart, whether
// it is an Album, a Movie, a Game, etc.
type Image struct {
	Title   string `db:"title"`
	Caption string `db:"caption"`
	URL     string `db:"url"`
}

type ImagesTextPosition string

const (
	ImagesTextHide    ImagesTextPosition = "hide"
	ImagesTextInline  ImagesTextPosition = "inline"
	ImagesTextLeft    ImagesTextPosition = "left"
	ImagesTextRight   ImagesTextPosition = "right"
	ImagesTextBelow   ImagesTextPosition = "below"
	ImagesTextOverlay ImagesTextPosition = "overlay"
)

type ImagesShape string

const (
	ImageShapeSquare   = "square"
	ImageShapePortrait = "portrait"
)

type Chart struct {
	ID      int       `db:"rowid"`
	UserID  int       `db:"user_id"`
	Name    string    `db:"name"`
	Created time.Time `db:"created"`
	Updated time.Time `db:"updated"`

	Images      []Image `db:"-"`
	Title       string  `db:"title"`
	ColumnCount uint8   `db:"column_count"`
	RowCount    uint8   `db:"row_count"`
	Spacing     uint8   `db:"spacing"`
	Padding     uint8   `db:"padding"`

	ImagesSize         uint8              `db:"images_size"`
	ImagesShape        ImagesShape        `db:"images_shape"`
	ImagesTextPosition ImagesTextPosition `db:"images_text_position"`

	BgColor        string `db:"bg_color"`
	BgGradientFrom string `db:"bg_gradient_from"`
	BgGradientTo   string `db:"bg_gradient_to"`
	BgImageURL     string `db:"bg_image_url"`

	TextColor string `db:"text_color"`
}

type ChartModel struct {
	DB *sqlx.DB
}

func (m *ChartModel) Insert(userID int) (int, error) {
	query := `INSERT INTO charts (user_id)
				VALUES (?)`

	result, err := m.DB.Exec(query, userID)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	stmt := `INSERT INTO
				charts_images (chart_id, image_position)
				VALUES (?, !);`

	b := strings.Builder{}

	// Generate 100 images for each new chart
	ids := make([]any, 100)
	for i := 0; i < len(ids); i++ {
		ids[i] = id
		line := strings.Replace(stmt, "!", strconv.Itoa(i), 1)

		b.WriteString(line)
	}

	tx, err := m.DB.Begin()
	if err != nil {
		return 0, err
	}
	_, err = tx.Exec(b.String(), ids...)
	if err != nil {
		return 0, err
	}

	err = tx.Commit()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

func (m *ChartModel) Get(id, userID int) (*Chart, error) {
	query := `SELECT rowid, *
			  FROM charts
			  WHERE rowid = ?
			  AND user_id = ?`

	c := &Chart{}
	err := m.DB.Get(c, query, id, userID)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNoRecord
		}

		return nil, err
	}

	query = `SELECT title, caption, url
		FROM images
		INNER JOIN charts_images ci
		ON ci.chart_id = ? AND images.url = ci.image_url
		ORDER BY ci.image_position ASC`

	images := []Image{}

	err = m.DB.Select(&images, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNoRecord
		}

		return nil, err
	}

	c.Images = images

	return c, nil
}

func (m *ChartModel) Latest(userID, n int) ([]Chart, error) {
	cs := []Chart{}
	query := `SELECT rowid, name, updated
				FROM charts
				WHERE user_id = ?
				ORDER BY updated DESC
				LIMIT ?`

	err := m.DB.Select(&cs, query, userID, n)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNoRecord
		}

		return nil, err
	}

	return cs, nil
}

func (m *ChartModel) Update(id int, title string, columns, rows, spacing, padding, imgsSize uint8) error {
	query := `UPDATE charts
				SET title = ?, column_count = ?, row_count = ?,
					spacing = ?, padding = ?, images_size = ?
				WHERE rowid = ?`

	_, err := m.DB.Exec(query, title, columns, rows, spacing, padding, imgsSize, id)

	return err
}
