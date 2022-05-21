use hdt_mem_reader::manager::ManagerHandle;

pub struct State {
    pub mem_manager: ManagerHandle,
}

impl State {
    pub fn new(mem_manager: ManagerHandle) -> Self {
        State { mem_manager }
    }
}
