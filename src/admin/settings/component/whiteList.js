import React, { Component } from 'react';
import { Button, Select, Form, Modal, message } from 'antd';
import Panel from '../../../components/panel';
import { FORM_ITEM_LAYOUT, SUBMIT_BTN_LAYOUT } from '../../util';
import { setWhiteList } from '../../cgi';
import '../index.css';

const { confirm } = Modal;
class WhiteList extends Component {
  checkWord = (list) => {
    if (list.length > 300) {
      message.success('白名单最多添加300个人名，请缩减后输入！');
      return false;
    }
    const checkResult = list.map(word => {
      if (word.length > 64) {
        message.success(`白名单的“${word}”已超过64字符长度，请缩减后输入！`);
        return false;
      }
      return true;
    });
    return checkResult.indexOf(false) === -1;
  }

  // 白名单人名用换行符\n分隔
  formatWhitelist = (list) => {
    return list.join('\n');
  }

  reformatWhiteList = (list) => {
    return list.indexOf('\n') !== -1 ? list.split('\n') : [];
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      const { whiteList } = value;
      if (!err && this.checkWord(whiteList)) {
        setWhiteList({ whiteList: this.formatWhitelist(whiteList) }, (data) => {
          if (!data) {
            message.error('操作失败，请稍后重试');
            return;
          }
          message.success('设置白名单成功！');
        });
      }
    });
  }

  handleDeselect = (value) => {
    const that = this;
    const whiteList = that.props.form.getFieldValue('whiteList');
    confirm({
      title: `确定将${value}移除白名单吗?`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onCancel() {
        that.props.form.setFieldsValue({
          whiteList,
        });
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { value = '' } = this.props;

    return (
      <div className="p-mid-con p-whitelist">
        <Panel title="设置白名单">
          <Form {...FORM_ITEM_LAYOUT} onSubmit={this.handleSubmit}>
            <Form.Item
              label="白名单"
            >
              {getFieldDecorator('whiteList', {
                initialValue: this.reformatWhiteList(value),
                rules: [{ required: true, message: '请输入白名单！' }],
              })(<Select
                mode="tags"
                placeholder="请输入一个或多个人名，每次输入后按回车即可录入"
                onDeselect={this.handleDeselect}
              />)}
            </Form.Item>
            <Form.Item {...SUBMIT_BTN_LAYOUT} wrapperCol={{ span: 4, offset: 20 }}>
              <Button type="primary" htmlType="submit">
                  保存
              </Button>
            </Form.Item>
          </Form>
        </Panel>
      </div>
    );
  }
}
export default Form.create({ name: 'whiteList' })(WhiteList);