package schema

import (
	"crypto/md5"
	"crypto/sha1"
	"encoding/hex"
	"github.com/apache/incubator-answer/internal/base/reason"
	"github.com/segmentfault/pacman/errors"
	"math/rand"
	"strings"
)

// CheckPassword 根据明文校验密码
func CheckPassword(loginPass, userPass string) (bool, error) {

	// 根据存储密码拆分为 Salt 和 Digest
	passwordStore := strings.Split(userPass, ":")
	if len(passwordStore) != 2 && len(passwordStore) != 3 {
		return false, errors.BadRequest(reason.NotAllowedLoginViaPassword)
	}

	// 兼容V2密码，升级后存储格式为: md5:$HASH:$SALT
	if len(passwordStore) == 3 {
		if passwordStore[0] != "md5" {
			return false, errors.BadRequest(reason.NotAllowedLoginViaPassword)
		}
		hash := md5.New()
		_, err := hash.Write([]byte(passwordStore[2] + loginPass))
		bs := hex.EncodeToString(hash.Sum(nil))
		if err != nil {
			return false, err
		}
		return bs == passwordStore[1], nil
	}

	//计算 Salt 和密码组合的SHA1摘要
	hash := sha1.New()
	_, err := hash.Write([]byte(loginPass + passwordStore[0]))
	bs := hex.EncodeToString(hash.Sum(nil))
	if err != nil {
		return false, err
	}

	return bs == passwordStore[1], nil
}

// SetPassword 根据给定明文设定 User 的 Password 字段
func SetPassword(password string) (string, error) {
	//生成16位 Salt
	salt := RandStringRunes(16)

	//计算 Salt 和密码组合的SHA1摘要
	hash := sha1.New()
	_, err := hash.Write([]byte(password + salt))
	bs := hex.EncodeToString(hash.Sum(nil))

	if err != nil {
		return "", err
	}

	//存储 Salt 值和摘要， ":"分割
	// user.Password = salt + ":" + string(bs)
	return salt + ":" + string(bs), nil
}

// RandStringRunes 返回随机字符串
func RandStringRunes(n int) string {
	var letterRunes = []rune("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}
