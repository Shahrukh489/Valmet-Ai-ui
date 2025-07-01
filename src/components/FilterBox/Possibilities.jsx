
import React, { useEffect, useState } from 'react'
import ListItem from '../ListItem/ListItem'
import { Loader2, TrendingUp, Package } from 'lucide-react';
import PackedColumn from '/image.png'

function Possibilities(props) {

    const [topConfigurations, setTopConfigurations] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const [parsedConfiguration, setParsedConfiguration] = useState([]);

    console.log(props.finalConfig)

    useEffect(() => {

        setIsLoading(true)
        const setConfigurations = async () => {
            try {
                const response = await fetch(
                  "https://wea-spt-use-dv-configurationsapi-001.azurewebsites.net/v1/configurations/getTopConfigurations"
                );
                var x = await response.json()
                console.log(x.result)
                setTopConfigurations(x.result)
            } catch (e) {
                //setError(e)
            } finally {
                setIsLoading(false)
            }
        }
        setConfigurations();
    }, []);

    useEffect(() => {

        setIsLoading(true)
        const setFinalMLFB = async () => {
            try {
                const response = await fetch(
                  "https://wea-spt-use-dv-configurationsapi-001.azurewebsites.net/generateMLFBString",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(props.mlfbCode),
                  }
                )
                  .then((response) => response.json())
                  .then((parsedJSON) => props.setMLFBArray(parsedJSON.result));
            } catch (e) {
                //setError(e)
            } finally {
                setIsLoading(false)
            }
        }
        setFinalMLFB();
    }, [props.finalConfig]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center azure-space-xl">
                <div className="flex items-center azure-gap-sm text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-sm">Loading configurations...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="azure-space-lg">
            {props.finalConfig.length === 0 ? (
                <div>
                    <div className="flex items-center azure-gap-sm azure-mb-md">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h4 className="text-lg font-semibold text-card-foreground">
                            Top Configurations
                        </h4>
                    </div>
                    <div className="bg-surface-secondary/50 rounded-lg azure-space-sm azure-mb-md">
                        <p className="text-sm text-muted-foreground">
                            Browse our most popular pre-configured columns below or use the form to create a custom configuration.
                        </p>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto azure-scrollbar">
                        {topConfigurations?.map((option) => (
                            <ListItem 
                                key={option.mlfb} 
                                mlfb={option.mlfb} 
                                configuration={option.configurations} 
                                partNumber={option.partNumber} 
                                price={option.price}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex items-center azure-gap-sm azure-mb-md">
                        <Package className="w-5 h-5 text-success" />
                        <h4 className="text-lg font-semibold text-card-foreground">
                            Your Custom Configuration
                        </h4>
                    </div>
                    <div className="bg-success/10 border border-success/20 rounded-lg azure-space-sm azure-mb-md">
                        <p className="text-sm text-success">
                            ✓ Configuration generated successfully. Review your specifications below.
                        </p>
                    </div>
                    <ListItem 
                        configuration={props.finalConfig} 
                        mlfb={props.mlfbCode} 
                        partNumber={props.partNumber} 
                        image={PackedColumn} 
                        price={props.price}
                    />
                </div>
            )}
        </div>
    )
}

export default Possibilities