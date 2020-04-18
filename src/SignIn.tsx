import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(event.currentTarget.value);
      if (event.currentTarget.value.length > 0) {
        toggle(true);
      } else {
        toggle(false);
      }
    };

    return (
      <div>
        <label>Username:
              <input name='username' value={username} onChange={(event) => {handleChange(event); }}></input>
            </label>
            <br />
            {toggleStatus &&
              <span>
                <label>Platform:</label>
                <table>
                <tbody>
                  <tr>
                    <td><PlatformButton text='Xbox' username={username} /></td>
                    <td><PlatformButton text='PSN' username={username} /></td>
                  </tr>
                  <tr>
                    <td><PlatformButton text='Steam' username={username} /></td>
                    <td><PlatformButton text='Stadia' username={username} /></td>
                  </tr>
                </tbody></table>
              </span>
          }
        </div>
    );
  }

function PlatformButton(props: {text: string, username: string}) {
    return (
      <Link to={`/${props.text.toLowerCase()}/${props.username.replace('#', '%23')}`}>
        <button className={'platformButton ' + props.text.toLowerCase()}>
          {props.text}
        </button>
      </Link>
    );
  }

export default SignInPage;
