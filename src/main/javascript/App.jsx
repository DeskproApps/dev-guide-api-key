import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders a Deskpro app.
 */
export default class App extends React.Component {

  static propTypes = {
    /**
     * Instance of the Deskpro App Sdk Client
     */
    dpapp: PropTypes.object
  };

  /**
   * @returns {Promise.<String, Error>}
   */
  readTicketOwnerEmail()
  {
    const { context } = this.props.dpapp;
    return context.getTabData().then(tabData => {

      const { emails, primary_email } = tabData.api_data.person;

      if (primary_email && primary_email.email) {
        return primary_email.email;
      }

      if (emails.length) {
        return emails[0].email;
      }

      return Promise.reject(new Error('could not find the email of the ticket owner'));
    });
  }

  /**
   * @param {string} email the subscriber email
   * @returns {Promise.<String, Error>}
   */
  readSubscriberStatus(email)
  {
    const { restApi } = this.props.dpapp;

    return restApi.fetchCORS(
      `https://us16.api.mailchimp.com/3.0/search-members?query=${email}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json' ,
          'Accept': 'application/json' ,
          'X-Proxy-SignWith': 'basic_auth anystring:{{apiKey}}'
        }
      }).then(response => {
      const { members } = response.body.exact_matches;
      if (members.length) {
        return members[0].status
      }
      return null;
    })
      ;
  }

  render() {
    return (
      <div>Hello world</div>
    );
  }
}
