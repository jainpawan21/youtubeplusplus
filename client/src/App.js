import { Switch, Route } from "react-router-dom";
import Home from './components/Home'
import Video from './components/Video'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
// import { makeStyles } from '@material-ui/core/styles';


// const useStyles = makeStyles((theme) => ({
//     root: {
//         flexGrow: 1,
//     },
//     menuButton: {
//         marginRight: theme.spacing(2),
//     },
// }));

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <AppBar position="fixed">
                    <Toolbar variant="dense">
                        Youtube++
                    </Toolbar>
                </AppBar>
                <Switch>
                    <Route path="/" component={Home} exact />
                    <Route path="/video" exact component={Video} />
                </Switch>
            </header>
        </div>
    );
}

export default App;
