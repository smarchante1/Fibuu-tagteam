// Import: React
// Import: Semantic
import { Segment, Grid, Button } from 'semantic-ui-react';
// Import: Components
import Calendar from '../../components/Calendar/Calendar';
import PageHeader from '../../components/PageHeader/PageHeader';
// Import: Dependencies
import Modal from 'react-modal';
import UserEventsList from '../../components/UserEventsList/UserEventsList';

Modal.setAppElement('#root');

export default function UserMain() {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column style={{ padding: '0 15rem 0 15rem' }}>
          <Calendar />
          <UserEventsList />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
