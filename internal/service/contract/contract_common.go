package contract

import (
	"context"
	"github.com/apache/incubator-answer/internal/entity"
	"time"
)

type ContractRepo interface {
	AddContract(contract *entity.Contract) (int64, error)
	DeleteContract(contractId int) error
	GetContractById(contractId int) (*entity.Contract, error)
	GetContractsWithRelationsByUserIdAndStatus(ctx context.Context, userId int, status entity.ContractStatus) ([]entity.Contract, error)
	GetContractInfoById(contractId int) (*entity.ContractInfo, error)
	GetContractInfoByInfoId(id int) (*entity.ContractInfo, error)
	GetContractWithRelations(contractId int) (*entity.Contract, error)
	GetUserById(contractId int) (*entity.User, error)
	UpdateContractStatus(contractId int, newStatus entity.ContractStatus) error
	GetAllContractInfos() ([]entity.ContractInfo, error)
	// 获取当前用户的所有合约信息
	GetUserContracts(userId string) ([]entity.Contract, error)
	GetUserContract(userId string, contractInfoId string, status entity.ContractStatus) (*entity.Contract, error)
	GetUserContractInvalid(userId string, contractInfoId string) (*entity.Contract, error)
	UpdateContractStatusAndEndTime(userId string, contractInfoId string, status entity.ContractStatus, endTime time.Time) error
}

// ContractCommon contract service
type ContractCommon struct {
	contractRepo ContractRepo
}

func NewContractCommon(
	contractRepo ContractRepo,
) *ContractCommon {
	return &ContractCommon{
		contractRepo: contractRepo,
	}
}
