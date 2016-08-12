import React, { Component, PropTypes } from 'react';

import Form, { FormWrap, Input } from '../../../Form';

export default class CreateAccount extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  static propTypes = {
    visible: PropTypes.bool.isRequired
  }

  state = {
    accountName: '',
    password1: '',
    password2: ''
  }

  render () {
    if (!this.props.visible) {
      return null;
    }

    return (
      <Form>
        <FormWrap>
          <Input
            floatingLabelText='Account Name'
            hintText='A descriptive name for the account'
            value={ this.state.accountName }
            onChange={ this.onEditAccountName } />
        </FormWrap>
        <FormWrap>
          <Input
            floatingLabelText='Password'
            hintText='A strong, unique password'
            type='password'
            value={ this.state.password1 }
            onChange={ this.onEditPassword1 } />
        </FormWrap>
        <FormWrap>
          <Input
            floatingLabelText='Password (repeat)'
            hintText='A strong, unique password'
            type='password'
            value={ this.state.password2 }
            onChange={ this.onEditPassword2 } />
        </FormWrap>
      </Form>
    );
  }

  onEditAccountName = (event) => {
    this.setState({
      accountName: event.target.value
    });
  }

  onEditPassword1 = (event) => {
    this.setState({
      password1: event.target.value
    });
  }

  onEditPassword2 = (event) => {
    this.setState({
      password2: event.target.value
    });
  }
}