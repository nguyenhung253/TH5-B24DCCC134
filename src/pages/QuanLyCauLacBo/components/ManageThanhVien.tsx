import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { Table, Button, Modal, Form, Select, Space, Tag, message, Row, Col, Input } from 'antd';
import { UserOutlined, SwapOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

const { Option } = Select;

export default function ManageThanhVien() {
	const thanhVienModel = useModel('QuanLyCauLacBo.thanhVien');
	const cauLacBoModel = useModel('QuanLyCauLacBo.cauLacBo');
	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
	const [filteredData, setFilteredData] = useState<any[]>([]);
	const [isChuyenCLBVisible, setIsChuyenCLBVisible] = useState(false);
	const [filterForm] = Form.useForm();
	const [chuyenForm] = Form.useForm();

	useEffect(() => {
		thanhVienModel.loadThanhVien();
		cauLacBoModel.loadCauLacBo();
	}, []);

	useEffect(() => {
		setFilteredData(thanhVienModel.thanhViens.filter((tv) => tv.trangThai === 'Active'));
	}, [thanhVienModel.thanhViens]);

	const handleFilter = (values: any) => {
		const filter = {
			cauLacBoId: values.cauLacBoId,
			trangThai: values.trangThai || 'Active',
			keyword: values.keyword,
		};

		const filtered = thanhVienModel.filterThanhVien(filter);
		setFilteredData(filtered);
	};

	const handleResetFilter = () => {
		filterForm.resetFields();
		setFilteredData(thanhVienModel.thanhViens.filter((tv) => tv.trangThai === 'Active'));
	};
	const handleChuyenCauLacBo = () => {
		if (selectedRowKeys.length === 0) {
			message.warning('Vui lòng chọn ít nhất một thành viên');
			return;
		}
		setIsChuyenCLBVisible(true);
	};

	const handleSubmitChuyenCLB = async (values: any) => {
		try {
			const count = await thanhVienModel.chuyenCauLacBo({
				thanhVienIds: selectedRowKeys,
				cauLacBoMoiId: values.cauLacBoMoiId,
				lyDo: values.lyDo,
			});
			message.success(`Đã chuyển ${count} thành viên sang câu lạc bộ mới`);
			setSelectedRowKeys([]);
			setIsChuyenCLBVisible(false);
			chuyenForm.resetFields();
		} catch (error: any) {
			message.error(error.message || 'Có lỗi xảy ra');
		}
	};

	const handleExportExcel = (cauLacBoId?: string) => {
		let dataToExport = filteredData;
		let fileName = 'Danh_sach_tat_ca_thanh_vien';

		if (cauLacBoId) {
			dataToExport = thanhVienModel.getThanhVienByCauLacBo(cauLacBoId);
			const cauLacBo = cauLacBoModel.getCauLacBoById(cauLacBoId);
			fileName = `Danh_sach_thanh_vien_${cauLacBo?.tenCauLacBo.replace(/\s+/g, '_')}`;
		}

		const exportData = dataToExport.map((tv, index) => ({
			STT: index + 1,
			'Họ tên': tv.hoTen,
			Email: tv.email,
			'Số điện thoại': tv.soDienThoai,
			'Giới tính': tv.gioiTinh,
			'Địa chỉ': tv.diaChi,
			'Sở trường': tv.soTruong,
			'Câu lạc bộ': getCauLacBoName(tv.cauLacBoId),
			'Ngày tham gia': dayjs(tv.ngayThamGia).format('DD/MM/YYYY'),
			'Trạng thái': tv.trangThai === 'Active' ? 'Hoạt động' : 'Không hoạt động',
		}));

		const ws = XLSX.utils.json_to_sheet(exportData);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Danh sách thành viên');
		XLSX.writeFile(wb, `${fileName}_${dayjs().format('YYYY-MM-DD')}.xlsx`);
		message.success('Xuất file Excel thành công');
	};

	const getCauLacBoName = (cauLacBoId: string) => {
		const cauLacBo = cauLacBoModel.cauLacBos.find((clb) => clb.id === cauLacBoId);
		return cauLacBo?.tenCauLacBo || 'N/A';
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: (selectedKeys: string[]) => {
			setSelectedRowKeys(selectedKeys);
		},
	};

	const columns = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			key: 'hoTen',
			sorter: (a: any, b: any) => a.hoTen.localeCompare(b.hoTen),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'soDienThoai',
			key: 'soDienThoai',
			width: 130,
		},
		{
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			key: 'gioiTinh',
			width: 100,
			align: 'center' as const,
		},
		{
			title: 'Sở trường',
			dataIndex: 'soTruong',
			key: 'soTruong',
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'cauLacBoId',
			key: 'cauLacBoId',
			render: (cauLacBoId: string) => getCauLacBoName(cauLacBoId),
		},
		{
			title: 'Ngày tham gia',
			dataIndex: 'ngayThamGia',
			key: 'ngayThamGia',
			width: 130,
			align: 'center' as const,
			sorter: (a: any, b: any) => new Date(a.ngayThamGia).getTime() - new Date(b.ngayThamGia).getTime(),
			render: (ngayThamGia: string) => dayjs(ngayThamGia).format('DD/MM/YYYY'),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			width: 120,
			align: 'center' as const,
			filters: [
				{ text: 'Hoạt động', value: 'Active' },
				{ text: 'Không hoạt động', value: 'Inactive' },
			],
			onFilter: (value: any, record: any) => record.trangThai === value,
			render: (trangThai: string) => (
				<Tag color={trangThai === 'Active' ? 'success' : 'default'} className={`status-tag ${trangThai.toLowerCase()}`}>
					{trangThai === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
				</Tag>
			),
		},
	];
	return (
		<div className='card-section'>
			<div className='section-header'>
				<h3 className='section-title'>
					<UserOutlined /> Quản lý thành viên câu lạc bộ
				</h3>
				<Space>
					<Button type='default' icon={<DownloadOutlined />} onClick={() => handleExportExcel()}>
						Xuất Excel tất cả
					</Button>
				</Space>
			</div>

			{/* Bộ lọc */}
			<div className='filter-section'>
				<Form form={filterForm} onFinish={handleFilter}>
					<Row gutter={16} className='filter-row'>
						<Col span={8}>
							<Form.Item label='Câu lạc bộ' name='cauLacBoId'>
								<Select placeholder='Chọn câu lạc bộ' allowClear>
									{cauLacBoModel.cauLacBos.map((clb) => (
										<Option key={clb.id} value={clb.id}>
											{clb.tenCauLacBo}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item label='Trạng thái' name='trangThai'>
								<Select placeholder='Chọn trạng thái' allowClear defaultValue='Active'>
									<Option value='Active'>Hoạt động</Option>
									<Option value='Inactive'>Không hoạt động</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item label='Từ khóa' name='keyword'>
								<Input placeholder='Tìm theo tên, email, SĐT' />
							</Form.Item>
						</Col>
						<Col span={24}>
							<div className='filter-buttons'>
								<Button type='primary' htmlType='submit' icon={<SearchOutlined />}>
									Tìm kiếm
								</Button>
								<Button onClick={handleResetFilter}>Đặt lại</Button>
							</div>
						</Col>
					</Row>
				</Form>
			</div>

			{/* Bulk actions */}
			{selectedRowKeys.length > 0 && (
				<div className='bulk-actions'>
					<div className='bulk-info'>Đã chọn {selectedRowKeys.length} thành viên</div>
					<div className='bulk-buttons'>
						<Button type='primary' icon={<SwapOutlined />} onClick={handleChuyenCauLacBo}>
							Chuyển câu lạc bộ cho {selectedRowKeys.length} thành viên
						</Button>
					</div>
				</div>
			)}

			<Table
				columns={columns}
				dataSource={filteredData}
				rowKey='id'
				loading={thanhVienModel.loading}
				rowSelection={rowSelection}
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					showTotal: (total) => `Tổng ${total} thành viên`,
				}}
			/>

			{/* Modal chuyển câu lạc bộ */}
			<Modal
				title={`Chuyển câu lạc bộ cho ${selectedRowKeys.length} thành viên`}
				visible={isChuyenCLBVisible}
				onOk={() => chuyenForm.submit()}
				onCancel={() => {
					setIsChuyenCLBVisible(false);
					chuyenForm.resetFields();
				}}
				confirmLoading={thanhVienModel.loading}
			>
				<Form form={chuyenForm} layout='vertical' onFinish={handleSubmitChuyenCLB}>
					<Form.Item
						label='Câu lạc bộ mới'
						name='cauLacBoMoiId'
						rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ mới' }]}
					>
						<Select placeholder='Chọn câu lạc bộ muốn chuyển đến'>
							{cauLacBoModel.getActiveCauLacBo().map((clb) => (
								<Option key={clb.id} value={clb.id}>
									{clb.tenCauLacBo}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item label='Lý do chuyển (tùy chọn)' name='lyDo'>
						<Input.TextArea rows={3} placeholder='Nhập lý do chuyển câu lạc bộ' />
					</Form.Item>

					<div className='form-note'>
						<p>
							<strong>Lưu ý:</strong>
						</p>
						<ul>
							<li>Thành viên sẽ được chuyển sang câu lạc bộ mới ngay lập tức</li>
							<li>Hành động này không thể hoàn tác</li>
							<li>Thông tin cá nhân của thành viên sẽ được giữ nguyên</li>
						</ul>
					</div>
				</Form>
			</Modal>
		</div>
	);
}
