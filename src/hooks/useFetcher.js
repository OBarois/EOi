import {useState, useEffect, useRef} from 'react'
import { OAuth2Client, OAuth2Fetch } from '@badgateway/oauth2-client'    


export default function useFetcher() {
    // State and setters for debounced value
    const controller = useRef(null)
    const token = useRef(null) 
    const lastServer = useRef(null)
    const [param, setParam] = useState({})

    const get_token = async (server, tokenendpoint, granttype, user, pass) => {
        // server, tokenendpoint, granttype, user, pass
    //   console.log(server)
    //   console.log(tokenendpoint)
      let client = null
      switch(granttype) {
          case "client_credentials":
              console.log('client_credentials!!!')
              client = new OAuth2Client({
                  server: server,
                  clientId: user,
                //   clientId: "rs-ddip-frontend"
                  clientSecret: pass,         
                  tokenEndpoint: tokenendpoint,        
              })       
              return new OAuth2Fetch({
                  client: client,
                  getNewToken: async () => {
                      return  client.clientCredentials()
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
                //   clientId: "user-web-client",
                  tokenEndpoint: tokenendpoint,        
              })   

              console.log(client)


              return new OAuth2Fetch({
                  client: client,
                  getNewToken: async () => {
                    return  client.password({
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
            console.log('default')
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

    const fetchURL = async (url, server, tokenendpoint, grantType, user, pass) => {
      controller.current = new AbortController()
    //   console.log('server:'+server+'  tokenendpoint:'+tokenendpoint+'  grantType:'+grantType+'  user:'+user+'  pass:'+pass)
    //   console.log('fetching: '+url)
      let response

        // reset token if server changed
        if (server !== lastServer.current) {
            token.current = null
            lastServer.current = server
            console.log('token reset')
        }
      if(tokenendpoint) {
        // console.log(token.current)
        if(token.current == null || token.current.token == null) {
            console.log('will get token')
            try {
                token.current =  await get_token(server, tokenendpoint, grantType, user, pass)
            }
            catch(err) {
                console.log(err)
                throw new Error('401')
                return null
            }
            
          }
        //   console.log(token.current)

        // if(token.current.token == null) {
        //     console.log('empty token !')
        //     // token.current = null
        //     throw new Error('401')
        // }
    
          try {
            response = await token.current.fetch(url, 
                {
                mode: 'cors', 
                credentials: 'include', 
                signal: controller.current.signal,
                headers: {
                    "Content-Type": "text/plain",
                    // 'Authorization': 'Bearer ' + window.btoa(user+":"+pass),
                },
                })
            if(response.status == 401) {
                // setStatus(newurl)
                token.current = null
                throw new Error('401')
            }
            return response
            }
          catch(err) {
              console.log(err)
              console.log("error token fetch")
              token.current = null
              throw new Error(err)
          }
      } else {
            try {
                response = await fetch(url, 
                    {
                    mode: 'cors', 
                    credentials: 'include', 
                    headers: {
                        "Content-Type": "text/plain",
                        'Authorization': 'Basic ' + window.btoa(user+":"+pass),
                    },
                    signal: controller.current.signal
                    })
                if(response.status == 401) {
                    // setStatus(newurl)
                    token.current = null
                    // throw new Error('401')
                }
                return response
            }
            catch (err) {
                console.log(err)
                console.log("error basic fetch")
                // if(err == 401) throw new Error('401')
                
            }

        }

    }

    const abort_fetchURL = () => {
        if(controller && controller.current) {
            controller.current.abort()
        }
    }

    const init_fetcher = async (server, tokenendpoint, grantType, user, pass) => {
        setParam({
            server: server, 
            tokenendpoint: tokenendpoint, 
            grantType:grantType,
            user: user, 
            pass: pass})
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
  
    return { fetchURL, init_fetcher, abort_fetchURL}
  }