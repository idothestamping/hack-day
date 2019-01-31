import axios from 'axios';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { SERVER_URL } from '../constants/server';

import Login from './auth/Login';
import Signup from './auth/Signup';
import Header from './header/Header';
import Home from './Home';
import Footer from './layout/Footer';
import Profile from './Profile';

export interface IAppState {
  user: any;
}

class App extends React.Component<any, IAppState> {
  public readonly state: IAppState = {
    user: null,
  };

  public componentDidMount = () => {
    this.getUser();
  }

  public getUser = () => {
    const token = localStorage.getItem('serverToken');
    if (token) {
      console.log('Found token', token);
      axios.post(`${SERVER_URL}/auth/current/user`, {
        headers: { Authorization: `Bearer ${token}`},
      })
        .then((response) => {
          console.log('Success');
          this.setState({
            user: response.data.user,
          });
        })
        .catch((error) => {
          console.log('Error looking up user by token', error, error.response);
          this.setState({ user: null });
        });
    } else {
      console.log('No token');
      this.setState({
        user: null,
      });
    }
  }

  public render() {
    console.log(this.state.user);
    return (
      <div className="App">
        <Header user={this.state.user} updateUser={this.getUser} />
        <Switch>
          <Route exact path="/"
            component={Home}
          />

          <Route path="/login"
            component={() => (
              <Login
                user={this.state.user}
                updateUser={this.getUser}
              />
            )}
          />

          <Route path="/signup"
            component={() => (
              <Signup
                user={this.state.user}
                updateUser={this.getUser}
              />
            )}
          />

          <Route path="/profile"
            component={() => (
              <Profile
                user={this.state.user}
              />
            )}
          />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default App;