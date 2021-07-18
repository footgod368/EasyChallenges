module Level0.Level0Init exposing (init)

{-| Init of Level1 Model.


# init

@docs init

-}

import Array
import Browser.Dom exposing (getViewport)
import GlobalFunction.GlobalBasics as GlobalBasics
import GlobalFunction.GlobalModule as GlobalModule
import Level0.Level0Type as Level0Type
import MainFunction.MainType as MainType
import Modules.Boundary as Boundary
import Modules.Brick as Brick
import Modules.EndPoint as EndPoint
import Modules.Event as Event
import Modules.GameControl as GameControl
import Modules.Needle as Needle
import Modules.NoticeBoard as NoticeBoard
import Modules.Player as Player
import Modules.SavePoint as SavePoint
import Task


{-| `init` of Level1 \`Model
-}
init : () -> ( Level0Type.Model, Cmd MainType.Msg )
init a =
    let
        newModel =
            { windowBoundary = ( 1000.0, 800.0 )
            , levelBoundary = ( 2000.0, 680.0 )
            , actEvent = Array.fromList []
            , event =
                Array.fromList
                    [ Event.init
                        { id = 1, name = "Event1" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon
                                (Array.fromList
                                    [ ( ( 360, 0 ), ( 360.0, 520.0 ) )
                                    ]
                                )
                            )
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 2, name = "Event2" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon
                                (Array.fromList
                                    [ ( ( 200, 440 ), ( 240.0, 440.0 ) )
                                    , ( ( 240, 440 ), ( 240.0, 480.0 ) )
                                    , ( ( 240, 480 ), ( 200.0, 480.0 ) )
                                    , ( ( 200, 480 ), ( 200.0, 440.0 ) )
                                    ]
                                )
                            )
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 3, name = "Event3" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon
                                (Array.fromList
                                    [ ( ( 660, 500 ), ( 660, 540 ) )
                                    , ( ( 660, 540 ), ( 700, 540 ) )
                                    , ( ( 700, 540 ), ( 700, 520 ) )
                                    , ( ( 700, 520 ), ( 660, 500 ) )
                                    ]
                                )
                            )
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 4, name = "Event4" }
                        Event.StartActivated
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon
                                (Array.fromList
                                    [ ( ( 120, 440 ), ( 120, 0 ) )
                                    ]
                                )
                            )
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 5, name = "Event5" }
                        (Event.AfterActEvent 6)
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon
                                (Array.fromList
                                    [ ( ( 120, 440 ), ( 120, 0 ) )
                                    ]
                                )
                            )
                        )
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 6, name = "Event6" }
                        (Event.AfterActEvent 4)
                        (Event.TimeAfterStart 20)
                        (Event.quickDuration 10)
                    ]
            , boundary = Boundary.normalInit
            , player = Player.init ( 50.0, 490.0 ) Player.defPlayerProperty Player.NoNextPropertyChange
            , bricks =
                Array.fromList
                    (List.concat
                        [ List.map (\i -> Brick.initPos (GlobalBasics.blockPos ( i, 15 ))) (List.range 1 5)
                        , List.map (\i -> Brick.initPos (GlobalBasics.blockPos ( i, 12 ))) (List.range 2 5)
                        , [ Brick.init
                                (GlobalBasics.blockPos ( 18, 14 ))
                                Brick.NormalAppearance
                                (GlobalModule.Visible (GlobalModule.InvisibleAfterEvent 3 GlobalModule.NoNextVisibility))
                                (GlobalModule.NoCollide GlobalModule.NoNextCollision)
                                GlobalModule.NoNextMove
                          ]
                        , [ Brick.initPos (GlobalBasics.blockPos ( 14, 14 ))
                          ]
                        , List.map (\i -> Brick.initPos (GlobalBasics.blockPos ( 19, i ))) (List.range 11 14)
                        , [ Brick.init
                                (GlobalBasics.blockPos ( 6, 12 ))
                                Brick.NormalAppearance
                                (GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 2 GlobalModule.NoNextVisibility))
                                (GlobalModule.Collide GlobalModule.NoNextCollision)
                                GlobalModule.NoNextMove
                          ]
                        , [ Brick.init
                                (GlobalBasics.blockPos ( 10, 14 ))
                                Brick.NormalAppearance
                                (GlobalModule.Visible GlobalModule.NoNextVisibility)
                                (GlobalModule.Collide GlobalModule.NoNextCollision)
                                (GlobalModule.Move
                                    (Array.fromList [])
                                    0.0
                                    1
                                    (GlobalModule.Move
                                        (Array.fromList
                                            [ GlobalBasics.blockPos ( 13, 14 )
                                            ]
                                        )
                                        5.0
                                        -1
                                        GlobalModule.NoNextMove
                                    )
                                )
                          ]
                        , [ Brick.init
                                (GlobalBasics.blockPos ( 22, 8 ))
                                (Brick.Detailed 100 100 "#000000")
                                (GlobalModule.Visible GlobalModule.NoNextVisibility)
                                (GlobalModule.Collide GlobalModule.NoNextCollision)
                                GlobalModule.NoNextMove
                          ]
                        ]
                    )
            , savePoints =
                Array.fromList [ SavePoint.init (GlobalBasics.blockPos ( 2, 14 )), SavePoint.init (GlobalBasics.blockPos ( 14, 13 )) ]
            , endPoint = EndPoint.init (GlobalBasics.blockPos ( 22, 14 ))
            , noticeBoards =
                Array.fromList
                    [ NoticeBoard.init
                        ( 200.0, 200.0 )
                        (NoticeBoard.Visible "Hello!"
                            (NoticeBoard.VisibleAfterEvent
                                4
                                "Wow, a moving Needle!"
                                (NoticeBoard.VisibleAfterEvent
                                    2
                                    "Wow, a hidden brick!"
                                    (NoticeBoard.VisibleAfterEvent
                                        1
                                        "Wow, a moving brick!"
                                        (NoticeBoard.VisibleAfterEvent
                                            3
                                            "Wow, a fake brick!"
                                            NoticeBoard.NoNextNoticeBoardVisibility
                                        )
                                    )
                                )
                            )
                        )
                        (GlobalModule.Move
                            (Array.fromList [ ( 400.0, 400.0 ) ])
                            10.0
                            2
                            (GlobalModule.Move
                                (Array.fromList [ ( 300.0, 300.0 ) ])
                                10.0
                                0
                                GlobalModule.NoNextMove
                            )
                        )
                        20
                    ]
            , needles =
                Array.fromList
                    [ Needle.initPos (GlobalBasics.addPosPos ( 0.0, 30.0 ) (GlobalBasics.blockPos ( 4, 14 )))
                    , Needle.init
                        (GlobalBasics.addPosPos ( 0.0, 30.0 ) (GlobalBasics.blockPos ( 4, 11 )))
                        (Needle.NormalNeedle 80.0 Needle.normalNeedleHeight)
                        (GlobalModule.Visible GlobalModule.NoNextVisibility)
                        (GlobalModule.Collide GlobalModule.NoNextCollision)
                        (GlobalModule.Move
                            (Array.fromList [])
                            0.0
                            4
                            (GlobalModule.Move
                                (Array.fromList [ ( 120.0, 260.0 ) ])
                                5.0
                                5
                                (GlobalModule.Move
                                    (Array.fromList [ ( 120.0, 430.0 ) ])
                                    10.0
                                    0
                                    GlobalModule.NoNextMove
                                )
                            )
                        )
                    ]
            , gameControl = GameControl.init MainType.Level1
            , mainScene = MainType.Level0
            , keyPressed = []
            }
    in
    ( newModel, Task.perform MainType.GetViewport getViewport )
