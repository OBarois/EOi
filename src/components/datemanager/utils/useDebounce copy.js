import {useState, useEffect} from 'react'


export default function useFetcher(value, delay) {
    // State and setters for debounced value
    const controller = useRef(null)

    const get_token = (tokenendpoint, granttype, user, pass) => {
      let server = tokenendpoint.substring(0,tokenendpoint.lastIndexOf('/'))
      let tendpoint = tokenendpoint.substring(tokenendpoint.lastIndexOf('/'))
      console.log(server)
      console.log(tendpoint)
      console.log(granttype+'/'+user+'/'+pass)

      let client = null
      switch(granttype) {
          case "client_credentials":
              console.log('client_credentials!!!')
              client = new OAuth2Client({
                  server: server,
                  clientId: user,
                  clientSecret: pass,         
                  tokenEndpoint: tokenendpoint,        
              })       

              return new OAuth2Fetch({
                  client: client,
                  getNewToken: async () => {
                      return client.clientCredentials()
                  },
                  onError: (err) => {
                      console.log(err)
                      throw new Error(`401`)
                      }
                  })
          case 'password':
              console.log('password!!!')
              client = new OAuth2Client({
                  server: server,
                  clientId: "cdse-public",
                  tokenEndpoint: tokenendpoint,        
              })   
              return new OAuth2Fetch({
                  client: client,
                  getNewToken: async () => {
                      return client.password({
                          username: user,
                          password: pass,         
                      })
                  },
                  // storeToken: (token) => {
                  //     console.log(token)
                  //     dispatch({ type: "set_token", value: JSON.stringify(token)})
                  // },
                  // getStoredToken: () => {
                  //     if (state.token) return JSON.parse(state.token)
                  //     return null
                  //   },
                  onError: (err) => {
                      console.log(err)
                      throw new Error(`401`)
                      }
                  })
      
          default:
              client = new OAuth2Client({
                  server: server,
                  clientId: user,
                  clientSecret: pass,         
                  tokenEndpoint: tokenendpoint,        
              })       

              return new OAuth2Fetch({
                  client: client,
                  getNewToken: async () => {
                      return client.clientCredentials()
                  },
                  onError: (err) => {
                      console.log(err)
                      throw new Error(`401`)
                      }
                  })
      

      }
    }


    const fetchURL = async (url,target,user,pass) => {
      controller.current = new AbortController()

      if(!token.current) {
        token.current =  get_token(target.tokenEndpoint, target.grantType, user, pass)
      }

      try {
        response = await token.current.fetch(url, 
            {
            mode: 'cors', 
            credentials: 'include', 
            signal: controller.current.signal
            })
      }
      catch(err) {
          console.log(err)
      }
      return response

    }


    // useEffect(
    //   () => {
    //     // Update debounced value after delay
    //     const handler = setTimeout(() => {
    //       setDebouncedValue(value);
    //     }, delay);
  
    //     // Cancel the timeout if value changes (also on delay change or unmount)
    //     // This is how we prevent debounced value from updating if value is changed ...
    //     // .. within the delay period. Timeout gets cleared and restarted.
    //     return () => {
    //       clearTimeout(handler);
    //     };
    //   },
    //   [value, delay] // Only re-call effect if value or delay changes
    // );
  
    return {fetchURL}
  }