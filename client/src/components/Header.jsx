import React from "react";
import { Row, Col, Menu } from "antd";
import {
    HomeOutlined,
    TeamOutlined,
    StarOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";

const Header = () => {

    const navigate = useNavigate();

    const navigateTo = (path) => {
        navigate(path);
    }

    return (
        <>
            <Row
                align="middle"
                justify="space-between"
                style={{
                    backgroundColor: "#001529",
                    height: "80px",
                    padding: "0 20px",
                }}
            >
                <Col style={{ color: "white" }}>
                    <div className="logo">My Random Title</div>
                </Col>
                <Col span={12} justify="end" align="middle">
                    <Menu
                        mode="horizontal"
                        defaultSelectedKeys={["1"]}
                        style={{
                            border: "none",
                            display: "flex",
                            justifyContent: "end",
                            width: "100%",
                            backgroundColor: "transparent",
                            color: "white",
                        }}
                    >
                        <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => {
                            navigateTo("/");
                        }}>
                            Leases
                        </Menu.Item>
                        <Menu.Item key="2" icon={<TeamOutlined />} onClick={() => {
                            navigateTo("/tenees");
                        }}>
                            Tenees
                        </Menu.Item>
                        <Menu.Item key="3" icon={<StarOutlined />} onClick={() => {
                            navigateTo("/favorites");
                        }}>
                            Favorites
                        </Menu.Item>
                        <Menu.Item key="4" icon={<UserOutlined />} onClick={() => {
                            navigateTo("/user/0");
                        }}>
                            Profile
                        </Menu.Item>
                    </Menu>
                </Col>
            </Row>
        </>
    );
};

export default Header;
