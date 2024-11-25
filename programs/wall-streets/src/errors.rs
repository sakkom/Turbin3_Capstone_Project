use anchor_lang::error_code;

#[error_code]
pub enum UserError {
    #[msg("Name must be between 1 and 32 characters")]
    NameTooLong,
    #[msg("Role numbers must be 0, 1 and 2")]
    InvalidRole,
    #[msg("Unauthorized role")]
    UnauthorizedRole,
}

#[error_code]
pub enum WallError {
    #[msg("Not space available")]
    NoSpaceAvailable,
}
