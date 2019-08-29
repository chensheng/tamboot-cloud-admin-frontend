import { Select } from 'antd';

const Option = Select.Option;

export function createByDataDict(dataDict, props={}, showAll=true) {
  return (
    <Select style={{width: '100%'}} {...props}>
      {showAll?<Option key="all" value="">全部</Option>:undefined}
      {Object.keys(dataDict).map(value => (
        <Option key={value} value={value}>{dataDict[value]}</Option>
      ))}
    </Select>
  );
}

export function createByList(list, valueField, textField, props={}, showAll=true) {
  return (
    <Select style={{width: '100%'}} {...props}>
      {showAll?<Option key="all" value="">全部</Option>:undefined}
      {list.map(item => (
        <Option key={item[valueField]} value={item[valueField]}>{item[textField]}</Option>
      ))}
    </Select>
  )
}
