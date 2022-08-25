import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CircularProgressWithLabel from "../../components/common/CircularProgressWithLabel";

import "./DashboardCard.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../components/App/AuthContext";
import { Button, MenuItem, Select, Stack } from "@mui/material";
import FormDialogAddTeam from "../../components/FormDialogAddTeam/FormDialogAddTeam";
import fetchData from "../../components/App/fetch";
import { AnalyticsServiceAPI } from "../../constants";

export interface DashBoardData {
  LabName: string;
  Course: string;
  Progress: number;
  Instructor: string;
  TimeLeft: string;
  Team?: string;
}

function TeamCard({
  team,
  lab,
  reRenderCard,
}: {
  team?: string;
  lab: string;
  reRenderCard: () => void;
}) {
  const [createTeamOpen, setCreateTeamOpen] = React.useState(false);
  const [teamSelect, setTeamSelect] = React.useState("");
  const { user, token, refresh_token, setToken } =
    React.useContext(AuthContext);
  const [data, setData] = React.useState<any[]>();
  React.useEffect(() => {
    // const abortController = new AbortController()
    fetchData(
      AnalyticsServiceAPI,
      `/labs/${lab}/teams`,
      token,
      refresh_token,
      setToken,
      {
        method: "GET",
        // signal: abortController.signal
      }
    ).then(setData);
    // return abortController.abort
  }, [token, refresh_token, setToken, lab]);

  return (
    <>
      <Typography variant="h5" component="div">
        {team ? (
          <Stack>
            {team}
            <Button
              variant="contained"
              size="small"
              sx={{ margin: "5px" }}
              onClick={() => {
                fetchData(
                  AnalyticsServiceAPI,
                  `/teams/${team}/leave?username=${user?.username}`,
                  token,
                  refresh_token,
                  setToken,
                  {
                    method: "POST",
                  }
                ).then(reRenderCard);
              }}
            >
              {" "}
              Leave Team{" "}
            </Button>
          </Stack>
        ) : (
          <Stack>
            <>
              <Select
                autoFocus
                onChange={(e) => setTeamSelect(e.target.value)}
                label="Teams"
                value={teamSelect}
                name="langSelect"
              >
                {data &&
                  data.map(
                    ({ name }: { name: string; lab_id: string }, index) => (
                      <MenuItem value={name} key={index}>
                        {name}
                      </MenuItem>
                    )
                  )}
                {console.log(data)}
              </Select>
              <Button
                variant="contained"
                size="small"
                sx={{ margin: "5px" }}
                onClick={() => {
                  fetchData(
                    AnalyticsServiceAPI,
                    `/teams/${teamSelect}/join?username=${user?.username}`,
                    token,
                    refresh_token,
                    setToken,
                    {
                      method: "POST",
                    }
                  ).then(reRenderCard);
                }}
              >
                {" "}
                Join Team{" "}
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => setCreateTeamOpen(true)}
              >
                {" "}
                Create Team{" "}
              </Button>
              <FormDialogAddTeam
                open={createTeamOpen}
                handleClose={() => setCreateTeamOpen(false)}
                handleSubmit={(event) => {
                  event.preventDefault();
                  const data = new FormData(event.currentTarget);
                  const lab_id = data.get("id");
                  const team = data.get("name");
                  fetchData(
                    AnalyticsServiceAPI,
                    "/teams/create",
                    token,
                    refresh_token,
                    setToken,
                    {
                      method: "POST",
                      body: JSON.stringify({
                        name: team,
                        lab_id,
                      }),
                    }
                  ).then(reRenderCard);
                }}
              />
            </>
          </Stack>
        )}
      </Typography>
    </>
  );
}

export default function DashboardCard({
  data,
  reRender,
}: {
  data: DashBoardData;
  reRender: () => void;
}) {
  const { user } = React.useContext(AuthContext);
  // const forceUpdate = useForceUpdate()
  if (!user) return <>No Auth Context</>;
  return (
    <Card sx={{ margin: "30px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <CardContent className="card_internal">
          <Typography component="div" variant="h5">
            Lab : {data.LabName}
          </Typography>
        </CardContent>
        <CardContent
          sx={{
            flex: "1 0 auto",
            borderRight: "1px solid grey",
            flexDirection: "column",
            justifyContent: "center",
          }}
          className="card_internal"
        >
          <Typography component="div" variant="h5">
            Course : {data.Course}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            Instructor : {data.Instructor}
          </Typography>
        </CardContent>
        <CardContent
          sx={{
            flex: "1 0 auto",
            borderRight: "1px solid grey",
            flexDirection: "column",
            justifyContent: "center",
          }}
          className="card_internal"
        >
          <TeamCard
            team={data.Team}
            lab={data.LabName}
            reRenderCard={reRender}
          />
        </CardContent>
        <CardContent className="card_internal">
          <Typography component="div" variant="h5">
            <CircularProgressWithLabel
              value={data.Progress}
              size="5rem"
            ></CircularProgressWithLabel>
          </Typography>
        </CardContent>
        <CardContent className="card_internal">
          <Typography component="div" variant="h5">
            {data.TimeLeft} Left
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          {data.Team ? (
            <>
              <Typography component="div" variant="h5">
                <Link to={`/environment/${data.Team}/${user.username}`}>
                  Continue
                </Link>
              </Typography>
              <IconButton aria-label="play/pause">
                <PlayArrowIcon sx={{ height: 38, width: 38 }} />
              </IconButton>
            </>
          ) : (
            <Typography component="div" variant="h5">
              No env Available
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
}
