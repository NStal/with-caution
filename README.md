# With-Caution

TypeScript type protocols for error-aware programming offer a workaround to the TypeScript/JavaScript error-throw system, which, according to <https://github.com/microsoft/TypeScript/issues/13219#issuecomment-1515037604>, remains unaddressed.

**Note:** This concept is in an early draft stage.

## Core Concepts

- **Return-Based Error Handling:** Errors are indicated through return types rather than throwing exceptions. Consequently, any thrown error signifies a critical bug.
- **'With-Caution' Functions:** A function/method labeled as 'with-caution' follows the signature `(option?: TInput): Caution.Res<TResult, TReason, TError>`.
- **Error Handling in WC Functions:** Inside 'with-caution' functions, exceptions thrown by non-WC functions are captured and converted into `Caution.Res` appropriately.
- **Error Outcomes:** An error results in `[null, TReason, TDirectError, ...TSuppressedErrors[]]`, where `TReason` can be navigated and managed by the type system.
- **Successful Outcomes:** A successful execution yields `[TResult]`.

## Advanced Guidelines for Complex Functions

- **Handling `TReason`:** The return of `TReason` indicates an issue. However, `TResult` might not necessarily be null, accommodating scenarios where partial success is possible.

## Performance Considerations

- **Destructuring Overhead:** The destructuring approach might introduce additional overhead. Nonetheless, if widely adopted, this protocol could be optimized by JavaScript runtime engine developers.

## Examples

While the approach towards handling errors need not be overly stringent, these examples aim to illustrate the potential capabilities of 'with-caution' protocols.

```typescript
import { CautionUtil } from "with-caution"
import * as fs from "fs"
// With Caution
function someBasic(option:{
    filename:string
}):Caution.Res<{data:{name:string,version:string,data:any}},"IOError" | "BrokenJSON" | "MissingName" | "InvalidData" | "InvalidParameter" | "FileNotExists">{
    if(!option.filename){
        return [null,"InvalidParameter", new Error("Missing filename")]
    }
    if(!fs.existsSync(option.filename)){
        return [null,"FileNotExists", new Error(`File not exists ${option.filename}`)]
    }
    try {
        let content = fs.readFileSync(option.filename,"utf8")
        try {
            let value = JSON.parse(content)
            if(typeof value?.name !== "string"){
                return [null,"MissingName",new Error(`Parsed content missing name: ${option.filename}`)]
            }
            if(typeof value?.version!== "string"){
                return [null,"InvalidData",new Error(`Parsed content missing version: ${option.filename}`)]
            }
            let {name,version,data} = value
            return [{name,version,data}]
        } catch(e) {
            return [null,"BrokenJSON",e]
        }
    } catch(e) {
        return [null,"IOError",e]
    }
}
// With Caution Digest And Summerize All Reasons
function someComplicatedTask(option:{
    filename: string
    minVersion: number
    maxVersion: number
}):Caustion.Res<
    {data:any},
    "InvalidParameter" |
    "BrokenFile" |
    "FileNotFound" | 
    "MinVersionUnmet" |
    "MaxVersionUnmet" 
    ,Error   // Which may not be very useful 
>{
    // since TResult might be null, we add a default value to avoid null check
    let [{name,version,data} = {},reason,...errors] = someBasic()
    // Digest underlying error into a more general error
    if(reason == "IOError"){
        return [null,"BrokenFile",new Error(reason),...errors]
    }else if(reason == "FileNotExists"){
        return [null,"FileNotFound",new Error(reason),...errors]
    } else if(reason == "BrokenJSON"){
        return [null,"BrokenFile",new Error(reason),...errors]
    } else if(reason == "MissingName"){
        return [null,"BrokenFile",new Error(reason),...errors]
    } else if(reason == "InvalidData"){
        return [null,"BrokenFile",new Error(reason),...errors]
    } else if(reason == "InvalidParameter"){
        return [null,"InvalidParameter",new Error(reason),...errors]
    } else if(reason){
        // In case type of reason is not never, we forgot to handle some cases, compiler will complain
        // In case type of reason is never, but runtime reaches here, it means there is a bug in the code.
        Caution.never(reason)
    }
    if(version < option.minVersion){
        return [null,"MinVersionUnmet",new Error(`Version ${version} is less than ${option.minVersion}`),...errors]
    }
    if(version > option.maxVersion){
        return [null,"MaxVersionUnmet",new Error(`Version ${version} is greater than ${option.maxVersion}`),...errors]
    }
   return [{data}]
}

// With Caution Propagate
function someComplicatedTaskPropagateError(option:{
    filename: string
    minVersion: number
    maxVersion: number
}):Caustion.Res<
    {data:any},
    Caution.ReasonOf<typeof someBasic> |
    "MinVersionUnmet" |
    "MaxVersionUnmet"
    ,Cuation.ErrorOf<typeof someBasic> | Error   // Which may not be very useful 
>{
    let [{name,version,data} = {},reason,...errors] = someBasic()
    if(reason){
        return [null,reason,...errors]
    }
    if(version < option.minVersion){
        return [null,"MinVersionUnmet",new Error(`Version ${version} is less than ${option.minVersion}`),...errors]
    }
    if(version > option.maxVersion){
        return [null,"MaxVersionUnmet",new Error(`Version ${version} is greater than ${option.maxVersion}`),...errors]
    }
    return [{data}]
}
```
