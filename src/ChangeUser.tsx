import React from 'react';
import { Redirect } from 'react-router-dom';

function ChangeUser() {

    localStorage.clear();

    return (
        <Redirect to='/'></Redirect>
    );
}

export default ChangeUser;
