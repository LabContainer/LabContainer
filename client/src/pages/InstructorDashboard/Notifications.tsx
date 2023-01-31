import "./Notifications.css";
import NotificationCard from "./NotificationCard";

function Notifications() {
    return (
        <div className="notifications">
            <div className="notifications-title"> 
                Upcoming Labs
            </div>
            <div>
                <NotificationCard></NotificationCard>  
            </div>
            <div className="notifications-title past"> 
                Past Labs
            </div>
            <div>
                <NotificationCard></NotificationCard>  
            </div>
        </div>
    );
}

export default Notifications;