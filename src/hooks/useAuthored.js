import axios               from 'axios';
import React, {useContext} from 'react';
import {useQuery}          from 'react-query';
import UserContext         from '../context/userContext';

import getHeaders from '../helpers/getHeaders';

function useAuthored()
{
	const {user}       = useContext(UserContext);
	const queryEnabled = user !== undefined;
	const email = user === undefined ? undefined : user.email;
	const queryKey     = [email, 'authored'];

	return useQuery(
		queryKey,
		() => getAuthored(user),
		{
			enabled  : queryEnabled,
			staleTime: 1000 * 60 * 60, // 60 minutes
		},
	);
}

async function getAuthored(user)
{
	const idToken = user === undefined ? undefined : await user.getIdToken();

	const headers  = getHeaders(idToken);
	const response = await axios.get(`${process.env.REACT_APP_REST_URL}/api/my/blueprints/`, headers);
	return new Set(response.data);
}

export default useAuthored;
