package contract

import (
	"context"
	"fmt"
	"github.com/apache/incubator-answer/internal/base/data"
	"github.com/apache/incubator-answer/internal/entity"
	"github.com/apache/incubator-answer/internal/service/contract"
	"time"
)

// userRepo user repository
type contractRepo struct {
	data *data.Data
}

func (c contractRepo) AddContract(contract *entity.Contract) (int64, error) {
	_, err := c.data.DB.Insert(contract)
	if err != nil {
		return 0, err
	}
	return int64(contract.Id), nil
}

func (c contractRepo) DeleteContract(id int) error {
	ce := new(entity.Contract)
	_, err := c.data.DB.ID(id).Delete(ce)
	if err != nil {
		return err
	}
	return nil
}

func (c contractRepo) GetContractById(id int) (*entity.Contract, error) {
	ce := new(entity.Contract)
	has, err := c.data.DB.ID(id).Get(ce)
	if err != nil {
		return nil, err
	}
	if !has {
		return nil, fmt.Errorf("contract with id %d not found", id)
	}
	return ce, nil
}

func (c contractRepo) GetContractInfoById(id int) (*entity.ContractInfo, error) {
	contract, err := c.GetContractById(id)
	if err != nil {
		return nil, err
	}
	return c.GetContractInfoByInfoId(contract.ContractInfoId)
}

// GetContractsWithRelationsByUserIdAndStatus 根据 userId 与status 获取 Contract 及其关联的 ContractInfo 和 User
func (c contractRepo) GetContractsWithRelationsByUserIdAndStatus(ctx context.Context, userId int, status entity.ContractStatus) ([]entity.Contract, error) {
	var contracts []entity.Contract

	// 构建查询条件
	queryCondition := map[string]interface{}{
		"user_id": userId,
		"status":  status,
	}

	// 查询符合条件的 Contract 列表
	err := c.data.DB.Where(queryCondition).Find(&contracts)
	if err != nil {
		return nil, err
	}

	// 遍历每个 Contract 并加载其关联的 ContractInfo 和 User 对象
	for i := range contracts {
		currContract := contracts[i]
		// 加载 ContractInfo
		currContract.ContractInfo, err = c.GetContractInfoById(currContract.Id)
		if err != nil {
			return nil, err
		}
		// 加载 User
		currContract.User = new(entity.User)
		has, err := c.data.DB.ID(currContract.UserId).Get(currContract.User)
		if err != nil {
			return nil, err
		}
		if !has {
			return nil, fmt.Errorf("user with id %d not found", currContract.UserId)
		}
	}

	return contracts, nil
}

func (c contractRepo) GetUserById(id int) (*entity.User, error) {
	// 首先根据 contractId 获取 Contract 实例
	var contract entity.Contract
	has, err := c.data.DB.ID(id).Get(&contract)
	if err != nil {
		return nil, err
	}
	if !has {
		return nil, fmt.Errorf("contract with id %d not found", contract.Id)
	}

	// 使用 Contract 中的 UserId 获取对应的 User 记录
	var user entity.User
	has, err = c.data.DB.ID(contract.UserId).Get(&user)
	if err != nil {
		return nil, err
	}
	if !has {
		return nil, fmt.Errorf("user with id %d not found", contract.UserId)
	}

	return &user, nil
}

func (c contractRepo) GetAllContractInfos() ([]entity.ContractInfo, error) {
	var contractInfos []entity.ContractInfo
	err := c.data.DB.Find(&contractInfos)
	if err != nil {
		return nil, fmt.Errorf("failed to query contract infos: %v", err)
	}
	return contractInfos, nil
}

func (c contractRepo) GetUserContract(userId string, contractInfoId string, status entity.ContractStatus) (*entity.Contract, error) {
	var contract entity.Contract
	has, err := c.data.DB.Where("user_id = ? AND contract_info_id = ? AND status = ?", userId, contractInfoId, status).
		OrderBy("created_at DESC"). // 按创建时间降序排列
		Limit(1).                   // 限制结果数量为1
		Get(&contract)
	if err != nil {
		return nil, err
	}
	if !has {
		return nil, nil // 或者返回一个自定义错误表示未找到记录
	}
	if contract.Status == entity.ContractEffective && contract.EndTime.Before(time.Now()) {
		// 如果合约已过期，更新状态为 ContractExpired
		contract.Status = entity.ContractExpired
		// 更新数据库中的状态
		_, err := c.data.DB.ID(contract.Id).Cols("status").Update(&contract)
		if err != nil {
			return nil, fmt.Errorf("failed to update contract status: %v", err)
		}
		// 过期了
		return nil, fmt.Errorf("The user contract has expired")
	}
	contract.ContractInfo, _ = c.GetContractInfoById(contract.Id)
	return &contract, nil
}

func (c contractRepo) UpdateContractStatusAndEndTime(userId string, contractInfoId string, status entity.ContractStatus, endTime time.Time) error {
	contract := &entity.Contract{
		Status:  status,
		EndTime: endTime,
	}

	affected, err := c.data.DB.Where("user_id = ? AND contract_info_id = ?", userId, contractInfoId).
		Cols("status", "end_time").
		Update(contract)

	if err != nil {
		return err
	}
	if affected == 0 {
		return fmt.Errorf("未找到符合条件的合同记录")
	}
	return nil
}

func (c contractRepo) GetUserContractInvalid(userId string, contractInfoId string) (*entity.Contract, error) {
	var contract entity.Contract
	has, err := c.data.DB.Where("user_id = ? AND contract_info_id = ? AND status <> ?", userId, contractInfoId, entity.ContractEffective).OrderBy("created_at DESC"). // 按创建时间降序排列
																						Limit(1). // 限制结果数量为1
																						Get(&contract)
	if err != nil {
		return nil, err
	}
	if !has {
		return nil, nil // 或者返回一个自定义错误表示未找到记录
	}
	if contract.Status == entity.ContractEffective && contract.EndTime.Before(time.Now()) {
		// 如果合约已过期，更新状态为 ContractExpired
		contract.Status = entity.ContractExpired
		// 更新数据库中的状态
		_, err := c.data.DB.ID(contract.Id).Cols("status").Update(&contract)
		if err != nil {
			return nil, fmt.Errorf("failed to update contract status: %v", err)
		}
		// 过期了
		return nil, fmt.Errorf("The user contract has expired")
	}
	contract.ContractInfo, _ = c.GetContractInfoById(contract.Id)
	return &contract, nil
}

func (c contractRepo) GetContractInfoByInfoId(id int) (*entity.ContractInfo, error) {
	var contractInfo entity.ContractInfo
	has, err := c.data.DB.ID(id).Get(&contractInfo)
	if err != nil {
		return nil, err
	}
	if !has {
		return nil, fmt.Errorf("contract info with id %d not found", id)
	}

	return &contractInfo, nil
}

func (c contractRepo) UpdateContractStatus(contractId int, newStatus entity.ContractStatus) error {
	// 首先根据 contractId 获取 Contract 实例
	contract := new(entity.Contract)
	has, err := c.data.DB.ID(contractId).Get(contract)
	if err != nil {
		return err
	}
	if !has {
		return fmt.Errorf("contract with id %d not found", contractId)
	}

	// 更新 Contract 的 Status
	contract.Status = newStatus
	affected, err := c.data.DB.ID(contractId).AllCols().Update(contract)
	if err != nil {
		return err
	}

	if affected == 0 {
		return fmt.Errorf("failed to update contract status for id %d", contractId)
	}

	return nil
}

// 获取当前用户的所有合约信息
func (c contractRepo) GetUserContracts(userId string) ([]entity.Contract, error) {
	var contracts []entity.Contract
	// 查询当前用户的所有合约
	err := c.data.DB.Where("user_id = ?", userId).Find(&contracts)
	if err != nil {
		return nil, fmt.Errorf("failed to query contracts: %v", err)
	}

	// 遍历合约，检查是否过期
	for i, contract := range contracts {
		if contract.Status == entity.ContractEffective && contract.EndTime.Before(time.Now()) {
			// 如果合约已过期，更新状态为 ContractExpired
			contract.Status = entity.ContractExpired
			// 更新数据库中的状态
			_, err := c.data.DB.ID(contract.Id).Cols("status").Update(&contract)
			if err != nil {
				return nil, fmt.Errorf("failed to update contract status: %v", err)
			}
			// 更新本地数据
			contracts[i].Status = entity.ContractExpired
		}
		// 加载 ContractInfo
		contract.ContractInfo, err = c.GetContractInfoById(contract.Id)
		if err != nil {
			return nil, err
		}
	}

	return contracts, nil
}

// GetContractWithRelations 根据 contractId 获取 Contract 及其关联的 ContractInfo 和 User
func (c contractRepo) GetContractWithRelations(id int) (*entity.Contract, error) {
	contract, err := c.GetContractById(id)
	if err != nil {
		return nil, err
	}
	if contract.Status != entity.ContractEffective {
		return nil, fmt.Errorf("contract status invalid")
	}
	// 获取当前时间
	currentTime := time.Now()
	// 比较两个时间
	if !contract.EndTime.IsZero() && currentTime.After(contract.EndTime) {
		err := c.UpdateContractStatus(contract.Id, entity.ContractExpired)
		if err != nil {
			return nil, err
		}
		return nil, fmt.Errorf("contract status invalid")
	}
	// 加载 ContractInfo
	contract.ContractInfo, err = c.GetContractInfoById(id)
	if err != nil {
		return nil, err
	}
	// 加载 User
	contract.User = new(entity.User)
	has, err := c.data.DB.ID(contract.UserId).Get(contract.User)
	if err != nil {
		return nil, err
	}
	if !has {
		return nil, fmt.Errorf("user with id %d not found", contract.UserId)
	}

	return contract, nil
}

// NewContractRepo new repository
func NewContractRepo(data *data.Data) contract.ContractRepo {
	return &contractRepo{
		data: data,
	}
}
