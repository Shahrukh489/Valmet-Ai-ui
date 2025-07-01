import React, { useState } from 'react';
import { Copy, Check, Hash, Code2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

function MLFB(props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!props.mlfbCode) return;
        
        try {
            await navigator.clipboard.writeText(props.mlfbCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = props.mlfbCode;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-success/10 rounded-lg">
                        <Code2 className="h-5 w-5 text-success" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Generated MLFB Code</CardTitle>
                        <CardDescription>
                            Your unique manufacturing part number code
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    
                    {/* MLFB Code Display */}
                    <div className="space-y-2">
                        <Label htmlFor="mlfb-code" className="text-sm font-medium">
                            MLFB Code
                        </Label>
                        <div className="relative">
                            <Input
                                id="mlfb-code"
                                type="text"
                                value={props.mlfbCode || ''}
                                readOnly
                                placeholder="MLFB code will appear here after configuration..."
                                className={cn(
                                    "pr-12 font-mono text-sm bg-muted/50",
                                    props.mlfbCode && "text-foreground bg-background"
                                )}
                            />
                            
                            {/* Copy Button */}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleCopy}
                                disabled={!props.mlfbCode}
                                className={cn(
                                    "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0",
                                    !props.mlfbCode && "opacity-50 cursor-not-allowed"
                                )}
                                title={copied ? 'Copied!' : 'Copy MLFB code'}
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-success" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                props.mlfbCode ? "bg-success animate-pulse" : "bg-muted-foreground"
                            )}></div>
                            <span className="text-sm text-muted-foreground">
                                {props.mlfbCode ? "Code Generated" : "Waiting for configuration"}
                            </span>
                        </div>

                        {copied && (
                            <div className="flex items-center space-x-1 text-success">
                                <Check className="h-4 w-4" />
                                <span className="text-sm font-medium">Copied!</span>
                            </div>
                        )}
                    </div>

                    {/* Information */}
                    {props.mlfbCode ? (
                        <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                            <div className="flex items-start space-x-2">
                                <Hash className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-success mb-1">
                                        MLFB Code Generated Successfully
                                    </p>
                                    <p className="text-success/80">
                                        Use this code for ordering, documentation, and system integration. 
                                        The code uniquely identifies your configured column specifications.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-muted/50 border border-border rounded-lg p-3">
                            <div className="flex items-start space-x-2">
                                <Code2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-muted-foreground mb-1">
                                        Configuration in Progress
                                    </p>
                                    <p className="text-muted-foreground">
                                        Complete the configuration form to generate your unique MLFB code. 
                                        Each selection will contribute to the final part number.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </CardContent>
        </Card>
    );
}

export default MLFB;