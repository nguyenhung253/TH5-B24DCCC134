import { useEffect } from 'react';
import { Tabs } from 'antd';
import { TeamOutlined, BarChartOutlined } from '@ant-design/icons';

import ManageCauLacBo from './components/ManageCauLacBo';
import BaoCaoThongKe from './components/BaoCaoThongKe';

import './styles.less';

const { TabPane } = Tabs;

export default function QuanLyCauLacBoPage() {

	return (
		<div className='quanlyvanbang-container'>
			<div className='quanlyvanbang-card'>
				<div className='page-header'>
					<div className='header-left'>
						<img src='/logo.png' alt='PTIT Logo' className='ptit-logo' />
						<div className='header-text'>
							<h1 className='page-title'>Hệ thống quản lý câu lạc bộ</h1>
							<p className='page-subtitle'>Học viện Công nghệ Bưu chính Viễn thông</p>
						</div>
					</div>
				</div>

				<Tabs defaultActiveKey='1' className='quanlyvanbang-tabs'>
					<TabPane
						key='1'
						tab={
							<span className='tab-label'>
								<TeamOutlined />
								Danh sách CLB
							</span>
						}
					>
						<ManageCauLacBo />
					</TabPane>

					<TabPane
						key='2'
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
