import React from 'react';
import './App.css';
import Stock from './components/Stock';
import StockAdd from './components/StockAdd';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';

const Styles = theme => ({
  root: {
    // flexGrow: 1,
    width: '100%',
    minWidth: 768
    // overflowX: "hidden"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    }, 
  },
  menu: {
    marginTop: 15,
    marginBottom: 15,
    display: 'flex',
    justifyContent: 'center'
  },
  paper: {
    marginLeft: 18,
    marginRight: 18
  },
  
});

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      stocks:"",
      completed: 0,
      searchKeyword:""
    }
  }

  stateRefresh = () => {
    this.setState({
      stocks:"",
      completed: 0,
      searchKeyword:""
    });
    this.callapi()
    .then(res => this.setState({stocks: res}))
    .catch(err => console.log(err));
  }

  componentDidMount() {
    this.timer = setInterval(this.progress, 20);
    this.callapi()
    .then(res => this.setState({stocks: res}))
    .catch(err => console.log(err));
  }


  callapi = async () => {
    const response = await fetch('/api/stocks');
    const body = await response.json();
    return body;
  }

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1});
  }
  render() {
    const filteredComponents = (data) => {
      data = data.filter((c) => {
        return c.name.indexOf(this.state.searchKeyword) > -1;
      });
      return data.map((c) => {
        return <Stock stateRefresh={this.stateRefresh} key={c.id} id={c.id} name={c.name} now={c.now} fluctuat={c.fluctuat} />
      });
    }
    const { classes } = this.props;
    const cellList = ["종목코드", "종목명", "현재가", "등락률", "설정"]
    return(
      <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            전체보기
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="검색하기"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              name="searchKeyword"
              value={this.state.searchKeyword}
              onChange={this.handleValueChange}
            />
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.menu}>
      <StockAdd stateRefresh={this.stateRefresh}/>
      </div>
      <Paper className={classes.paper}>
      <Table>
        <TableHead>
          <TableRow>
            {cellList.map(c => {
              return <TableCell className={classes.TableHead}>{c}</TableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody>
            {this.state.stocks ? 
              filteredComponents(this.state.stocks) :
            <TableRow>
              <TableCell colSpan="5" align="center">
                <CircularProgress  variant="determinate" value={this.state.completed} />
              </TableCell>  
            </TableRow>
            }
        </TableBody>
      </Table>
    </Paper>
    </div>
    );
  }
}

export default withStyles(Styles)(App);
