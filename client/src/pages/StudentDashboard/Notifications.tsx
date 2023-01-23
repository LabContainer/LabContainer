import "./Labs.css";
import NotificationCard from "./NotificationCard";

function Notifications() {
    return (
        <div className="labs">
            <div className="labs-title"> 
                Upcoming Labs
            </div>
            <div>
                <NotificationCard></NotificationCard>  
            </div>
            <div className="labs-title past"> 
                Past Labs
            </div>
            <div>
                <NotificationCard></NotificationCard>  
            </div>
        </div>
    );
}

export default Notifications;