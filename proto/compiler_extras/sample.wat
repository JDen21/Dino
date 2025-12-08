(module
  ;; Import WASI fd_write for stdout
  (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

  ;; 1 page = 64 KiB memory
  (memory (export "memory") 1)

  (func $add (param $first i32) (param $second i32) (result i32)
    local.get $first
    local.get $second
    i32.add
    return)

  ;; WASI looks for `_start` as the entrypoint
  (func (export "_start")
    ;; ---- Set up iovec ----
    ;; iovec structure:
    ;; offset 0: pointer to string
    ;; offset 4: length of string

    ;; Write pointer = 20
    i32.const 0 ;; memory offset 0
    i32.const 9 ;; pointer to string (data below)
    i32.store

    ;; Write length = 14
    i32.const 4 ;; memory offset 4
    i32.const 14 ;; length of string
    i32.store

    ;; ---- Call fd_write ----
    i32.const 1 ;; stdout (fd 1)
    i32.const 0 ;; iovs pointer
    i32.const 1 ;; number of iovecs
    i32.const 8 ;; location to write number of bytes written
    call $fd_write

    ;; add 5 and 12 then store at mem 15
    i32.const 15
    i32.const 5
    i32.const 12
    call $add
    i32.store

    ;; print in console
    i32.const 1
    i32.const 15
    i32.const 1
    i32.const 9
    call $fd_write

    drop ;; ignore errno
  )

  ;; ---- String data ----
  (data
    (i32.const 9) "Hello, WASI!!!\n"))
