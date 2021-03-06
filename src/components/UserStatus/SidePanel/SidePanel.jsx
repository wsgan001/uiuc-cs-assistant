import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import { LinearProgress } from 'material-ui/Progress';
import ListSubheader from 'material-ui/List/ListSubheader';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import Icon from 'material-ui/Icon';
import SvgIcon from 'material-ui/SvgIcon';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import AddCircle from 'material-ui-icons/AddCircle';
import AddIcon from 'material-ui-icons/Add';
import { CSSTransitionGroup } from 'react-transition-group';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
} from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import 'babel-polyfill';

const dict = {
  'Basics':['cs100','cs101','cs105','cs125','cs126','cs173','cs196','cs199','cs210','cs225','cs233','cs241','cs242',
  'cs296','cs357','cs361','cs374'],
  'Software Foundations':
  ['cs422','cs426','cs427','cs428','cs429','cs476','cs477','cs492','cs493','cs494','cs498 Software Testing','cs522','cs524','cs526','cs527','cs528','cs576'],
  'Algorithms and Models of Computation':
  ['cs413','cs473','cs475','cs476','cs477','cs481','cs482','cs571','cs572','cs573','cs574','cs575','cs576','cs579','cs583',
  'cs584'],
  'Intelligence and Big Data':
  ['cs410','cs411','cs412','cs414','cs440','cs443','cs445','cs446','cs447','cs466','cs467','cs510','cs511','cs512','cs543',
  'cs544','cs546','cs548','cs566','cs576','cs598 Mach Lrng for Signal Processng'],
  'Human and Social Impact':
  ['cs416','cs460','cs461','cs463','cs465','cs467','cs468','cs498 Art and Science of Web Prog','cs498 The Art of Web Programming','cs563','cs565'],
  'Media':
  ['cs414','cs418','cs419','cs445','cs465','cs467','cs498 Virtual Reality','cs519','cs565','cs598 Mach Lrng for Signal Processng'],
  'Scientific, Parallel, and High Performance Computing':
  ['cs419','cs450','cs457','cs466','cs482','cs483','cs484','cs519','cs554','cs555','cs556','cs558'],
  'Distributed Systems, Networking, and Security':
  ['cs423','cs424','cs425','cs431','cs436','cs438','cs439','cs460','cs461','cs463','cs483','cs484','cs523','cs524','cs525',
  'cs538','cs563'],
  'Machines':
  ['cs423','cs424','cs426','cs431','cs433','cs484','cs523','cs526','cs533','cs536','cs541','cs584','cs598 Parallel Programming'],
  'Group Project':
  ['cs427','cs428','cs429','cs445','cs465','cs467','cs493','cs494']
};

// these import and function Transition handles the dialog
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';

import styles from './SidePanel.scss'

const style = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
  bottomNav: {
    width: '100%',
  },
  icon: {
    margin: theme.spacing.unit,
    filter: 'drop-shadow(2px 1px 2px rgba(0,0,0,0.5))',
    fontSize: '2em',
  },
});

class SidePanel extends Component {
  // static propTypes = {
  //   classes: PropTypes.object.isRequired,
  // }

  constructor(props) {
    super(props);
    // let goalList = [];
    // goalList.push({
    //   name: "Finish an AI project",
    //   status: false,
    // });
    // goalList.push({
    //   name: "Build a garbage website",
    //   status: true,
    // });
    this.state = {
      value: '',
      open: false,
      progress: 0,
      user: {},
      inProgress: true,
      query1Result: undefined,
      query2Result: undefined,
      adv1: undefined,
      adv2: undefined,
    };

    this.number = 1;
    this.flag = true;

    this.onGoalChange = this.onGoalChange.bind(this);

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleProgressCheck = this.handleProgressCheck.bind(this);
    this.handleQuery1 = this.handleQuery1.bind(this);
    this.handleQuery2 = this.handleQuery2.bind(this);
    this.handleAdv1 = this.handleAdv1.bind(this);
    this.handleAdv2 = this.handleAdv2.bind(this);
  }

  async componentDidMount() {
    const { cookies } = this.props;
    let email = cookies.get('login');
    let user;
    email = unescape(email);
    console.log('in SidePanel: ' + email);
    if (email) {

      let takenCourse = [];
      await axios.get('/api/user/takenCourse', {
        params: {
          email: email
        }
      }).then((response) => {
        takenCourse = response.data.data.classes;
      }).catch((error) => {
        console.error(error);
      });
      // end read csv file
      await axios.get('api/user/info', {
        params: {
          email: email
        }
      }).then((response) => {
        user = response.data.data[0];
        user.classTaken = takenCourse;
        let takeClasses = user.classTaken.length;
        console.log('in SidePanel: track:' + user.direction);
        console.log(dict[user.direction]);
        var goalList = []
        axios.get('api/user/goals', {
          params: {
            email: email
          }
        }).then((response) => {
          user.goals = response.data.data;
          var classTakenTrack = 0;
          for (var i=0; i<dict[user.direction].length; i++) {
            if(dict[user.direction].indexOf(user.classTaken[i]) !== -1) {
              classTakenTrack += 1;
            }
          }
          this.setState({
            progress: parseFloat((classTakenTrack / dict[user.direction].length * 100).toFixed(2)),
            user: user,
          });
        }).catch((error) => {
          console.log('in SidePanel');
          console.error(error);
        });
      }).catch((error) => {
        console.log('in SidePanel');
        console.error(error);
      });
      console.log(this.state.user.direction);
      console.log('adv3');
    }
  }

  onGoalChange(index) {
    console.log('gonal on Click');
    let user = this.state.user;
    if (user) {

      let message = user.goals[index];
      user.goals.splice(index, 1);
      requestAnimationFrame(() => {
        this.setState({
          user: user
        });
      });

      const { cookies } = this.props;
      let email = cookies.get('login');
      email = unescape(email);

      axios.put('api/user/goals', {message: message}, {
        params: {
          email: email
        }
      }).then((response) => {
        console.log('Delete Success');
      }).catch((error) => {
        console.error(error);
      });
      return;
    }
  }

  handleClickOpen () {
    this.setState({ open: true });
    console.log("open");
    console.log(this.state.value);
  }

  handleRequestClose () {
    this.setState({ open: false });
    console.log("close");
  }

  handleOnChange(event) {
    console.log(event.target.value);
    this.setState({ value : event.target.value });
  }

  // Add an user goal
  handleOnSubmit() {
    let user = this.state.user;
    if (user) {
      // let new_goal = {
      //   goal: this.state.value,
      //   inProgress: this.state.inProgress,
      // }
      let new_goal = this.state.value;
      user.goals.push(new_goal);
      console.log('new_goal: ' + new_goal);
      this.setState({
        value: '',
        inProgress: true,
        user: user,
        open: false,
      });

      const { cookies } = this.props;
      let email = cookies.get('login');
      email = unescape(email);
      axios.post('api/user/goals', {message: new_goal}, {
        params: {
          email: email
        }
      }).then((response) => {
        console.log("Insert Goal Success");
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  handleProgressCheck({value}) {
    this.setState({
      inProgress: !this.state.inProgress,
    });
  }

  handleQuery1() {
    axios.get('/api/user/allUserAvgGPA')
    .then((response) => {
      let data = response.data.data;
      console.log('Query 1 ----');
      console.log(data);
      // let result = {
      //   emails: data.userList,
      //   gpas: data.avgGPAList,
      // }

      let gpa = 0;
      for (var i = 0; i < data.avgGPAList.length; i++) {
        gpa += data.avgGPAList[i];
      }
      gpa /= data.avgGPAList.length;
      let result = {
        emails: ['Avg GPA'],
        gpas: [gpa],
      }


      this.setState({ query1Result: result });
    }).catch((error) => {
      console.error(error);
    });
  }

  handleQuery2() {
    axios.get('/api/user/trackAvgGPA')
    .then((response) => {
      let data = response.data.data;
      let result = {
        tracks: data.trackList,
        gpas: data.avgGPAList,
      }
      this.setState({ query2Result: result });
    }).catch((error) => {
      console.error(error);
    });
  }

  handleAdv1() {
    axios.get('/api/user/getAdv1', {
      params: {
        direction: this.state.user.direction
      }
    }).then((response) => {
      let data = response.data.data[0];
      // console.log(data);
      data = data.split(';');
      this.setState({ adv1: data });
    }).catch((error) => {
      console.error(error);
    });
  }

  handleAdv2() {
    axios.get('/api/user/getAdv2', {
      params: {
        direction: this.state.user.direction
      }
    }).then((response) => {
      let data = response.data.data[0];
      // console.log(data);
      data = data.split(';');
      this.setState({ adv2: data });
    }).catch((error) => {
      console.error(error);
    });
  }

  render() {
    let goalList = this.state.user.goals;
    if (goalList == undefined) {
      goalList = [];
    }
    const { classes } = this.props;
    let query1List = this.state.query1Result ? this.state.query1Result.emails : [];
    let query2List = this.state.query2Result ? this.state.query2Result.tracks : [];

    let adv1 = this.state.adv1 ? this.state.adv1 : [];
    let adv2 = this.state.adv2 ? this.state.adv2 : [];

    return (
      <Grid
        className="SidePanel"
        xs={12}
        sm={12}
        md={3}
        item>
        <Card className='side-item card-progress'>
          <ListSubheader>Your Progress</ListSubheader>
          <LinearProgress
            className='progress-bar'
            mode="determinate" value={this.state.progress} />
          <Typography type="headline" component="h2">
            {this.state.progress + "%"}
          </Typography>
        </Card>
        <Paper className='side-item query-result adv-func-1'>
          <Typography variant="headline" component="h2">
            Top 4 professors
            <List>
              {
                adv1.map((item, index) => {
                  return (
                    <ListItem button key={index}>
                      <ListItemText primary={item} />
                    </ListItem>
                  );
                })
              }
            </List>
            <Button
              variant="raised"
              color="primary"
              className={classes.button}
              onClick={this.handleAdv1}
              disabled={this.state.adv1 !== undefined}
              >
              Get Result
            </Button>
          </Typography>
        </Paper>
        <Paper className='side-item query-result adv-func-2'>
          <Typography variant="headline" component="h2">
            Top 4 courses
            <List>
              {
                adv2.map((item, index) => {
                  return (
                    <ListItem button key={index}>
                      <ListItemText primary={item} />
                    </ListItem>
                  );
                })
              }
            </List>
            <Button
              variant="raised"
              color="primary"
              className={classes.button}
              onClick={this.handleAdv2}
              disabled={this.state.adv2 !== undefined}
              >
              Get Result
            </Button>
          </Typography>
        </Paper>
        <Paper className='side-item query-result adv-query-1'>
          <Typography variant="headline" component="h2">
            Avg User GPA
            <List>
              {
                query1List.map((email, index) => {
                  return (
                    <ListItem button key={index}>
                      <ListItemText primary={email + ' '  + this.state.query1Result.gpas[index].toFixed(2)} />
                    </ListItem>
                  );
                })
              }
            </List>
            <Button
              variant="raised"
              color="primary"
              className={classes.button}
              onClick={this.handleQuery1}
              disabled={this.state.query1Result !== undefined}
              >
              Get Result
            </Button>
          </Typography>
        </Paper>
        <Paper className='side-item query-result adv-query-2'>
          <Typography variant="headline" component="h2">
            Avg Track GPA On Users
            <List>
              {
                query2List.map((track, index) => {
                  return (
                    <ListItem button key={index}>
                      <ListItemText primary={track + ' '  + this.state.query2Result.gpas[index].toFixed(2)} />
                    </ListItem>
                  );
                })
              }
            </List>
            <Button
              variant="raised"
              color="primary"
              className={classes.button}
              onClick={this.handleQuery2}
              disabled={this.state.query2Result !== undefined}
              >
              Get Result
            </Button>
          </Typography>
        </Paper>
        <Paper className='side-item sideProgress'>
          <LinearProgress mode="determinate" value={this.state.progress} />
          <Avatar className='orangeAvatar'>
            {this.state.progress + "%"}
          </Avatar>
        </Paper>
        <Card className='side-item goal-board'>
          <Typography type="title" className='section-title'>
            Semester Goals
            <Button
              fab
              mini
              aria-label="add"
              onClick={this.handleClickOpen}
              className='goal-item-add-btn'>
              <AddIcon />
            </Button>
          </Typography>
          <Dialog
            className='dialog'
            open={this.state.open}
            onRequestClose={this.handleRequestClose}
            >
            <DialogTitle>Add New Goal</DialogTitle>
            <DialogContent
              className=''
              >
              <TextField
                autoFocus
                margin="dense"
                id="newgoal"
                label="New Goal"
                type="text"
                onChange={this.handleOnChange}
                fullWidth
                />
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.inProgress}
                      onChange={this.handleProgressCheck}
                      value={this.state.inProgress}
                      />
                  }
                  label="In Progress"
                  />
              </FormGroup>
            </DialogContent>
            <DialogActions
              className='dialog-action'
              >
              <Button
                color="primary"
                className='dialog-btn-submit'
                onClick={this.handleOnSubmit}
                >
                Submit
              </Button>
              <Button
                className='dialog-btn-close'
                onClick={this.handleRequestClose}
                >
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <CSSTransitionGroup
            className='goalList'
            transitionName="example"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnterTimeout={800}
            transitionLeaveTimeout={500}>
            {
              goalList.map((goal, index) => {
                let statusClass = goal.inProgress === true ? 'finish' : 'in-progress';
                let statusLabel = goal.inProgress === true ? 'F' : 'IP';
                return (
                  <ListItem
                    id={goal.goal}
                    className={'goal show ' + statusClass}
                    onClick={() => this.onGoalChange(index)}
                    key={index}
                    button
                    >
                    {goal}
                    <Chip label={statusLabel} className='goalStatusChip' />
                  </ListItem>
                );
              })
            }
          </CSSTransitionGroup>
        </Card>
      </Grid>
    );
  }
}

export default withCookies(withStyles(style)(SidePanel));
