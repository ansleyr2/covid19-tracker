import { ErrorHandler, Injectable, Injector, Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

/**
 * Handle any errors thrown by Angular application
 */
@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

    constructor(
        @Inject(Injector) private readonly injector: Injector
    ) {
        super();
    }

    handleError(error) {
        console.log("Handling error: ", error);
        let errorMsgText = '';
        if (error instanceof HttpErrorResponse) {
            if (error.error instanceof ErrorEvent) {
                console.error("Error Event");
                errorMsgText = "Error Event";
            } else {
                console.log(`error status : ${error.status} ${error.statusText}`);
                /*switch (error.status) {
                    case 401:      //login
                        //this.router.navigateByUrl("/login");
                        break;
                    case 403:     //forbidden
                        //this.router.navigateByUrl("/unauthorized");
                        break;
                }*/
                errorMsgText = "Service Error, Pull down to refresh";
            } 
        } else {
            console.error("some thing else happened");
            errorMsgText = "Application Error, Please retry";
        }
        
        this.toastrService.error(errorMsgText, null);
        
        super.handleError(error);
    }

    /**
     * Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
     * @returns {} 
     */
    private get toastrService(): ToastrService {
        return this.injector.get(ToastrService);
    }

}
