import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from '../../components/Calendar/Calendar';
import FormEvCreate from '../../components/Form_EvCreate/Form_EvCreate';
import SideNav from '../../components/SideNav/SideNav';
import Loading from '../../components/Loading/Loading';
import * as eventsAPI from '../../utils/eventAPI';
import userService from '../../utils/userService';
import {
  Container,
  Segment,
  Grid,
  Button,
  Modal,
  Icon,
  Image,
  Header,
} from 'semantic-ui-react';

export default function Profile({ user, loading, setLoading }) {
  const [userEvents, setUserEvents] = useState([]);
  const [profileUser, setProfileUser] = useState({});
  const { username } = useParams();

  // ========== Event Calls ========== //
  const getUserEvents = useCallback(async () => {
    try {
      const response = await eventsAPI.getAll();
      const filteredEvents = response.data.filter(
        (event) => event.user?.username === username
      );
      setUserEvents([...filteredEvents]);
    } catch (err) {
      console.log(err.message, '<< err.message < getUserEvents < Profile');
    }
  }, [username]);
  // console.log(userEvents, '<< userEvents < getUserEvents < Profile');

  // ========== User Calls ========== //
  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile(username);
      setProfileUser(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  }, [setLoading, username]);
  // console.log(profileUser, '<< profileUser < getUserEvents < Profile');

  // ========== useEffect ========== //
  useEffect(() => {
    console.log('useEfx in Profile()');
    getUserEvents();
    getProfile();
  }, [getUserEvents, getProfile]);

  // ========== Modal ==========
  function modalReducer(state, action) {
    switch (action.type) {
      case 'OPEN_MODAL':
        return { open: true, dimmer: action.dimmer };
      case 'CLOSE_MODAL':
        return { open: false };
      default:
        throw new Error();
    }
  }

  const [modal, setModal] = React.useReducer(modalReducer, {
    open: false,
    dimmer: undefined,
  });
  const { open, dimmer } = modal;

  return (
    <>
      <Grid>
        <SideNav userEvents={userEvents} />
        <Grid.Row>
          <Grid.Column style={{ padding: '0 15rem 0 15rem' }}>
            {user.username === username ? (
              <Button
                animated="vertical"
                style={{ width: '10rem' }}
                onClick={() =>
                  setModal({ type: 'OPEN_MODAL', dimmer: 'blurring' })
                }
              >
                <Button.Content hidden>Add New Event</Button.Content>
                <Button.Content visible>
                  <Icon name="calendar plus outline" />
                </Button.Content>
              </Button>
            ) : (
              <Button animated="vertical" style={{ width: '10rem' }}>
                <Button.Content hidden>Follow</Button.Content>
                <Button.Content visible>
                  <Icon name="user circle" />
                </Button.Content>
              </Button>
            )}
            <Header as="h3" floated="right">
              <Image
                size="large"
                avatar
                src={
                  profileUser.photoUrl
                    ? profileUser.photoUrl
                    : 'https://react.semantic-ui.com/images/wireframe/square-image.png'
                }
              />
              {profileUser.username}
            </Header>
            {loading ? (
              <Loading />
            ) : (
              <Calendar themeSystem="Simplex" userEvents={userEvents} />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Modal
        closeIcon
        dimmer={dimmer}
        open={open}
        onClose={() => setModal({ type: 'CLOSE_MODAL' })}
      >
        <Modal.Header>Create New Event</Modal.Header>
        <Modal.Content>
          <FormEvCreate
            user={user}
            setModal={setModal}
            getUserEvents={getUserEvents}
          />
        </Modal.Content>
      </Modal>
    </>
  );
}
