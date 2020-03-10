                
                // =========================================
                // Custom nav component
                //===========================================
                (function(manywho) {
                
                class NavColumn extends React.Component {
                        constructor(props) {
                            super(props);
                            this.state = manywho.state.getComponent(this.props.id, this.props.flowKey) || {};
                            this.id = props.id;
                            this.str = document.location.search;
                            this.stateId = this.str.replace("?join=", "");
                            this.str2 = document.location.pathname;
                            this.tenantId = this.str2.split('/')[1];
                        }
                        
                        
                        async nav (){
                            console.log("____________Click____________"); 
                            console.log("this ==>", this); //Logging
                            console.log("this.props.contentValue (I.e. element ID to navigate to) ==>", this.props.contentValue); //Logging
                            
                            //The custom component will invoke the 'Invoke Flow State' Endpoint. Documentation: https://manywho.github.io/docs-api/#operation/InvokeState
                            const invokeurl = ("https://flow.manywho.com/api/run/1/state/" + this.stateId);
                            console.log("invokeurl ==>", invokeurl); //Logging
                            console.log("Documentation of the 'Invoke Flow State' endpoint: https://manywho.github.io/docs-api/#operation/InvokeState")
                            
                            const info = manywho.state.getState(this.props.flowKey);
                            console.log("info (manywho.state.getState) ==>", info); //Logging
                            //Define request to be sent to flow invoke state endpoint
                            const request={};
                            request.currentMapElementId = info.currentMapElementId;
                            console.log("request.currentMapElementId ==>", request.currentMapElementId); //Logging
                            
                            request.invokeType = 'NAVIGATE';
                            console.log("request.invokeType ==>", request.invokeType); //Logging
                            
                            request.mapElementInvokeRequest = {};
                            request.mapElementInvokeRequest.selectedOutcomeId = null;
                            console.log("request.mapElementInvokeRequest ==>", request.mapElementInvokeRequest); //Logging
                            console.log("request.mapElementInvokeRequest.selectedOutcomeId ==>", request.mapElementInvokeRequest.selectedOutcomeId); //Logging
                            
                            request.pageRequest = {
                                pageComponentInputResponses: [
                                    { pageComponentId: this.props.id, contentValue: null, objectData: null},
                                ],
                            };
                            console.log("request.pageRequest ==>",request.pageRequest); //Logging
                            console.log("this.props.id ==>", this.props.id); //Logging
                            
                            request.selectedMapElementId = this.props.contentValue;
                            console.log("request.selectedMapElementId ==>", request.selectedMapElementId); //Logging
                            
                            request.stateId = this.stateId;
                            console.log("request.stateId ==>", request.stateId); //Logging
                            
                            request.stateToken = info.token;
                            console.log("request.stateToken ==>", request.stateToken); //Logging
                            console.log("Navigating to map element ID (this.props.contentValue / request.props.contentValue) ==>", this.props.contentValue); //Logging
                            
                            // console.log(JSON.stringify(request)); //Logging
                            console.log("this.tenantId ==>", this.tenantId)
                            //Execute the call to the 'Invoke Flow State' endpoint
                            console.log("Call 'Invoke Flow State' endpoint...");
                            const resp = await manywho.connection.request(this, null, invokeurl , 'POST',  this.tenantId, this.stateId, manywho.state.getAuthenticationToken(this.flowKey), request);
                            
                            console.log("this.props.flowKey ==>", this.props.flowKey); //Logging
                            manywho.model.parseEngineResponse(resp, this.props.flowKey);
                            await manywho.engine.sync(this.props.flowKey);
                            console.log("Sync with current flow state..."); //Logging
                            
                            await manywho.engine.render(this.props.flowKey);
                            console.log("Re-render including current outcome buttons..."); //Logging
                        }
                        
                        componentDidMount() {
                        }
                        
                         render() {
                            return React.createElement('btn', {
                                    className: "btn btn-primary",
                                    onClick: this.nav.bind(this)
                                },
                                ("Navigate to this step - ID: " + this.props.contentValue),
                            
                            );
                
                        }
                    }
                manywho.component.register('nav-column', NavColumn);
                }(manywho));
                
                // End custom nav component
                
                //Disable small table conversion
                manywho.component.register('mw-table-small', manywho.component.getByName('mw-table-large'));
