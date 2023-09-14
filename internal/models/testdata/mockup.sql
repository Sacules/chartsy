INSERT INTO users (
	email,
	hashed_password,
	is_verified
) VALUES (
	"test@foo.bar",
	"3alksdas2d44as23423dAS5dAsdlasldaSLdLAsoi2p21e12xp*2EX!!2xp1",
	true
);

INSERT INTO charts (user_id) VALUES (1);
INSERT INTO charts (user_id) VALUES (1);
INSERT INTO charts (user_id) VALUES (1);

INSERT INTO images (url) VALUES ('https://i.imgur.com/w4toMiR.jpg');
