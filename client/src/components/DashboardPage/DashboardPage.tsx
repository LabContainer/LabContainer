import { Grid } from "@mui/material";
import "./DashboardPage.css";

function DashboardPage({children} : { children: any}) {
    return (
        <Grid container spacing={0}>
            <Grid item xs={12} container className="dashboard-column" justifyContent="center">
                <div className="dashboard-box">
                    {children}
                </div>
            </Grid>
        </Grid>
    );
}

export default DashboardPage;