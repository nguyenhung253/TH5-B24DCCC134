import { useEffect } from 'react';
import { Tabs } from 'antd';
import { TeamOutlined, FileTextOutlined, UserOutlined, BarChartOutlined } from '@ant-design/icons';

import ManageCauLacBo from './components/ManageCauLacBo';
import ManageDonDangKy from './components/ManageDonDangKy';
import ManageThanhVien from './components/ManageThanhVien';
import BaoCaoThongKe from './components/BaoCaoThongKe';
import { seedMockData } from '@/services/QuanLyCauLacBo/mockData';

import './styles.less';

const { TabPane } = Tabs;

export default function QuanLyCauLacBoPage() {
	useEffect(() => {
		seedMockData();
	}, []);

	return (
		<div className='quanlycaulacbo-container'>
			<div className='quanlycaulacbo-card'>
				<div className='page-header'>
					<div className='header-left'>
						<img src='/logo.png' alt='PTIT Logo' className='ptit-logo' />
						<div className='header-text'>
							<h1 className='page-title'>Hệ thống quản lý câu lạc bộ</h1>
							<p className='page-subtitle'>Học viện Công nghệ Bưu chính Viễn thông</p>
						</div>
					</div>
				</div>

				<Tabs defaultActiveKey='1' className='quanlycaulacbo-tabs'>
					<TabPane
						key='1'
						tab={
							<span className='tab-label'>
								<TeamOutlined />
								Danh sách câu lạc bộ
							</span>
						}
					>
						<ManageCauLacBo />
					</TabPane>

					<TabPane
						key='2'
						tab={
							<span className='tab-label'>
								<FileTextOutlined />
								Quản lý đơn đăng ký
							</span>
						}
					>
						<ManageDonDangKy />
					</TabPane>

					<TabPane
						key='3'
						tab={
							<span className='tab-label'>
								<UserOutlined />
								Quản lý thành viên
							</span>
						}
					>
						<ManageThanhVien />
					</TabPane>

					<TabPane
						key='4'
						tab={
							<span className='tab-label'>
								<BarChartOutlined />
								Báo cáo thống kê
							</span>
						}
					>
						<BaoCaoThongKe />
					</TabPane>
				</Tabs>
			</div>
		</div>
	);
}