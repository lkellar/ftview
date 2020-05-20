import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { Background } from './Util';

function SignInPage() {
    return (
      <div>
        <nav>
          <ul id='horizontal-nav'>
                <li><a href='https://lkellar.org'>lkellar.org</a></li>
            </ul>
        </nav>
        <main>
          <h1>Destiny Fireteam Inventory Viewer</h1>
          <h2>Quickly see what the other members of your Fireteam are using.</h2>

          <UserForm />
        </main>
        <Background />
      </div>
    );
  }

function UserForm() {
    const [toggleStatus, toggle] = useState(false);
    const [username, setUsername] = useState('');
    const [remember, toggleRemember] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(event.currentTarget.value);
      if (event.currentTarget.value.length > 0) {
        toggle(true);
      } else {
        toggle(false);
      }
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      toggleRemember(event.target.checked);
    };

    const savedUsername = localStorage.getItem('username');
    const savedPlatform = localStorage.getItem('platform');

    if (savedUsername && savedPlatform) {
      return (
        <Redirect to={`/${savedPlatform.toLowerCase()}/${savedUsername.replace('#', '%23')}`} />
      );
    }

    return (
      <div>
        <label>Username:
              <input name='username' value={username} onChange={(event) => {handleChange(event); }}></input>
            </label>
            <br />
            <br />
            <label><input type='checkbox' name='remember' checked={remember} onChange={(event) => {handleCheckboxChange(event); }}></input>
              Remember Me</label>
            <br />
            {toggleStatus &&
              <span>
                <label>Platform:</label>
                <table>
                <tbody>
                  <tr>
                    <td><PlatformButton text='Xbox' username={username} remember={remember}/></td>
                    <td><PlatformButton text='PSN' username={username} remember={remember}/></td>
                  </tr>
                  <tr>
                    <td><PlatformButton text='Steam' username={username} remember={remember}/></td>
                    <td><PlatformButton text='Stadia' username={username} remember={remember}/></td>
                  </tr>
                </tbody></table>
              </span>
          }
        </div>
    );
  }

function PlatformButton(props: {text: string, username: string, remember: boolean}) {
    return (
      <Link to={`/${props.text.toLowerCase()}/${props.username.replace('#', '%23')}`} onClick={() => {
        if (props.remember) {
          localStorage.setItem('username', props.username.replace('#', '%23'));
          localStorage.setItem('platform', props.text);
        }
        }}>
        <button className={'platformButton ' + props.text.toLowerCase()}>
          {props.text}
        </button>
      </Link>
    );
  }

export default SignInPage;
