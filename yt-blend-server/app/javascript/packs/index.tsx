// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom/client'

const Hello = (props: {name? :string}) => (
  <div>Hello {props.name}!</div>
)

Hello.defaultProps = {
  name: 'David2'
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM
      .createRoot(document.body.appendChild(document.createElement('div')))
      .render(
      <React.StrictMode>
        <Hello name="React" />
        <Hello />
      </React.StrictMode>)
});
