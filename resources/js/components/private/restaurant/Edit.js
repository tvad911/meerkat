import React, { Component } from 'react';
import {
  Button, Form, FormGroup, Modal, ModalBody, ModalHeader, ModalFooter
} from 'reactstrap';
import { FormGroups } from './common/FormGroups.js';
import ApiRestaurantActions from '../../../actions/api/RestaurantActions.js';
import ApiRestaurantStore from '../../../stores/api/RestaurantStore.js';

class RestaurantEdit extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
      this.state = {
        restaurant: {
          name: '',
          description: '',
          address: '',
          lat: '',
          lon: ''
        },
        modal: {
          open: false
        },
        validation: null
    }
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    ApiRestaurantStore
      .on("show.200", (data) => {
        if (this._isMounted) {
          this.setState({
            id: data.id,
            restaurant: {
              name: data.name,
              description: data.description,
              address: data.address,
              lat: data.lat,
              lon: data.lon
            },
            modal: {
              open: true
            }
          });
        }
      })
      .on("update.200", () => {
        if (this._isMounted) {
          this.setState({ modal: { open: false } });
        }
      })
      .on("update.error", () => {
        if (this._isMounted) {
          this.setState({ validation: 'Whoops! The restaurant could not be updated, please try again.' });
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleCancel(e) {
    this.setState({ modal: { open: false } });
    e.preventDefault();
  }

  handleChange = event => {
    let restaurant = {...this.state.restaurant};
    restaurant[event.target.id] = event.target.value;
    this.setState({restaurant});
  }

  handleUpdate(e) {
    ApiRestaurantActions.update(this.state.id, this.state.restaurant);
    e.preventDefault();
  }

  render() {
    return (
      <Modal isOpen={this.state.modal.open}>
        <ModalHeader>Restaurant</ModalHeader>
        <ModalBody>
          <p className="text-danger">{this.state.validation}</p>
          <Form className="form">
            <FormGroups {...this.state.restaurant} handleChange={this.handleChange} />
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={ (e) => this.handleUpdate(e) }>Update</Button>
          <Button color="secondary" onClick={ (e) => this.handleCancel(e) }>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export { RestaurantEdit };
