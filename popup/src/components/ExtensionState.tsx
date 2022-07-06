import React from 'react'

interface ExtensionStateProps {
  currentState: boolean,
}

function ExtensionState(props: ExtensionStateProps) {

  if(props.currentState){
    return (
      <h3>Currently <span>Enabled</span></h3>
    )
  } else {
    return (
      <h3>Currently <span>Disabled</span></h3>
    )
  }
  
}

export default ExtensionState