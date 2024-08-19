import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
const Logo = () => {
  return (
    <div
      style={{
        display: "flex",
        marginRight: "auto",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <Link to={"/"}>
        <img
          src="LOGO_WB.png"
          alt="openai"
          width={"50px"}
          height={"50px"}
          className="image-inverted"
          style={{ borderRadius: "100%" ,border: "2px solid #E5E2E2"}}
        />
      </Link>{" "}
      <Typography
        sx={{
          display: { md: "block", sm: "none", xs: "none" },
          mr: "auto",
          fontWeight: "800",
          textShadow: "2px 2px 20px #000",
        }}
      >
        <span style={{ fontSize: "20px" }}>CHITTI</span>-ChatBot
      </Typography>
    </div>
  );
};

export default Logo;
